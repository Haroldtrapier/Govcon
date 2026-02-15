const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Client } = require('@notionhq/client');
const { WebClient } = require('@slack/web-api');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const DATABASE_ID = '30804926-7278-8126-9c82-fc859f80c7c4';
const SLACK_CHANNEL = 'C0AF1KYV61L'; // trial-notifications channel

// Helper to calculate days remaining
function getDaysRemaining(trialEnd) {
  const now = new Date();
  const end = new Date(trialEnd * 1000);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

// Helper to send Slack notification using API
async function sendSlackNotification(message) {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.log('Slack notifications disabled: SLACK_BOT_TOKEN not set');
    return;
  }
  
  try {
    await slack.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: message,
      mrkdwn: true
    });
    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Slack notification error:', error.message);
  }
}

// Helper to add/update row in Notion
async function upsertTrialToNotion(customer, subscription) {
  const trialStart = subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString().split('T')[0] : null;
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString().split('T')[0] : null;

  // Determine status
  let status = 'Active Trial';
  if (subscription.status === 'active' && !subscription.trial_end) status = 'Converted ✅';
  if (subscription.status === 'canceled') status = subscription.trial_end ? 'Canceled in Trial ❌' : 'Churned';

  // Get plan name from price
  const planNames = {
    'price_1SrsnKKMDblnt0kLpGEgadkc': 'Starter ($97)',
    'price_1SrtRQKMDblnt0kL0pfxkd3t': 'Professional ($197)',
    'price_1SrtduKMDblnt0kL3KTakXur': 'Enterprise ($397)',
    'price_1SyhftKMDblnt0kLR9IZK6Bu': 'GovCon AI Pro ($497)',
    'price_1SzO81KMDblnt0kLVuwfzZ5K': 'Contractor Essentials ($597)',
    'price_1SzO81KMDblnt0kLvQLXztAR': 'Emergency Response ($1,197)',
    'price_1SzO81KMDblnt0kL3HeKdjjq': 'All-Access Pass ($3,997)'
  };

  const priceId = subscription.items?.data[0]?.price?.id || '';
  const planName = planNames[priceId] || 'Unknown Plan';
  const amount = subscription.items?.data[0]?.price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0;

  try {
    // Search for existing entry
    const existingPages = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Stripe Customer ID',
        rich_text: {
          equals: customer.id
        }
      }
    });

    const properties = {
      'Customer Email': { title: [{ text: { content: customer.email || 'No email' } }] },
      'Customer Name': { rich_text: [{ text: { content: customer.name || 'No name' } }] },
      'Plan': { select: { name: planName } },
      'Monthly Amount': { number: amount },
      'Stripe Customer ID': { rich_text: [{ text: { content: customer.id } }] },
      'Stripe Subscription ID': { rich_text: [{ text: { content: subscription.id } }] },
      'Status': { select: { name: status } }
    };

    if (trialStart) properties['Trial Started'] = { date: { start: trialStart } };
    if (trialEnd) {
      properties['Trial Ends'] = { date: { start: trialEnd } };
      properties['Days Remaining'] = { number: getDaysRemaining(subscription.trial_end) };
    }

    if (status.includes('Converted')) {
      properties['Converted Date'] = { date: { start: new Date().toISOString().split('T')[0] } };
    }

    if (status.includes('Canceled')) {
      properties['Canceled Date'] = { date: { start: new Date().toISOString().split('T')[0] } };
    }

    if (existingPages.results.length > 0) {
      // Update existing
      await notion.pages.update({
        page_id: existingPages.results[0].id,
        properties
      });
    } else {
      // Create new
      await notion.pages.create({
        parent: { database_id: DATABASE_ID },
        properties
      });
    }

    return { success: true, status, planName, customer: customer.email, amount };
  } catch (error) {
    console.error('Notion error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_TRIAL_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        // Only track if it has a trial or just converted
        if (subscription.trial_end || subscription.status === 'trialing') {
          const customer = await stripe.customers.retrieve(subscription.customer);
          const result = await upsertTrialToNotion(customer, subscription);
          
          // Send Slack notification for new trials
          if (event.type === 'customer.subscription.created' && subscription.trial_end) {
            const daysRemaining = getDaysRemaining(subscription.trial_end);
            await sendSlackNotification(
              `🎯 *New Trial Started!*\n` +
              `👤 Customer: ${customer.name || customer.email}\n` +
              `📦 Plan: ${result.planName}\n` +
              `💰 Value: $${result.amount}/month\n` +
              `⏳ Days Remaining: ${daysRemaining}\n` +
              `📊 <https://www.notion.so/Trial-Conversion-Tracker-3080492672788189be45fb7c792c063b|View Dashboard>`
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        await upsertTrialToNotion(customer, subscription);
        
        // Send Slack notification for cancellations
        await sendSlackNotification(
          `❌ *Trial Canceled*\n` +
          `👤 Customer: ${customer.name || customer.email}\n` +
          `📊 <https://www.notion.so/Trial-Conversion-Tracker-3080492672788189be45fb7c792c063b|View Dashboard>`
        );
        break;
      }

      case 'customer.subscription.trial_will_end': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const daysRemaining = getDaysRemaining(subscription.trial_end);

        // Update with days remaining
        const result = await upsertTrialToNotion(customer, subscription);

        // Send Slack notification (trial ending soon)
        await sendSlackNotification(
          `⚠️ *Trial Ending Soon!*\n` +
          `👤 Customer: ${customer.name || customer.email}\n` +
          `📦 Plan: ${result.planName}\n` +
          `💰 Value: $${result.amount}/month\n` +
          `⏳ Days Remaining: ${daysRemaining}\n` +
          `💡 Consider reaching out!\n` +
          `📊 <https://www.notion.so/Trial-Conversion-Tracker-3080492672788189be45fb7c792c063b|View Dashboard>`
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true, event_type: event.type });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
};
