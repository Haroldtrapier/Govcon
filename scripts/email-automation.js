#!/usr/bin/env node
/**
 * AUTOMATED TRIAL EMAIL FOLLOW-UPS
 * Sends personalized emails based on trial status
 */

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = '30804926-7278-8126-9c82-fc859f80c7c4';

// Email templates
const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to GovCon AI - Your Trial Has Started! 🚀',
    body: (name, plan) => `
<h2>Welcome, ${name}!</h2>

<p>We're thrilled to have you start your trial of <strong>${plan}</strong>!</p>

<h3>🎯 Here's What to Do Next:</h3>
<ol>
  <li><strong>Set Up Your Account</strong> - Complete your profile</li>
  <li><strong>Explore Key Features</strong> - Check out SAM.gov monitoring</li>
  <li><strong>Connect Your Tools</strong> - Integrate Slack for real-time alerts</li>
</ol>

<h3>📚 Resources:</h3>
<ul>
  <li><a href="https://govconcommandcenter.com/how-it-works">How It Works</a></li>
  <li><a href="https://govconcommandcenter.com/faq">FAQ</a></li>
  <li><a href="#">Schedule a Demo</a></li>
</ul>

<p><strong>Need help?</strong> Reply to this email anytime!</p>

<p>Best regards,<br>
The GovCon AI Team</p>
`
  },
  
  midTrial: {
    subject: 'Getting the Most Out of Your GovCon AI Trial',
    body: (name, plan, daysRemaining) => `
<h2>Hi ${name},</h2>

<p>You're halfway through your <strong>${plan}</strong> trial (${daysRemaining} days left)!</p>

<h3>💡 Pro Tips to Maximize Your Trial:</h3>
<ol>
  <li><strong>Set Up Custom Alerts</strong> - Get notified about relevant opportunities</li>
  <li><strong>Explore NAICS Codes</strong> - Monitor contracts in your industry</li>
  <li><strong>Use AI Search</strong> - Find opportunities faster with AI-powered search</li>
</ol>

<h3>📊 Your Progress:</h3>
<p>Have you tried all the features yet? We want to make sure you get the most value before your trial ends.</p>

<p><strong>Questions?</strong> Let's chat! <a href="#">Schedule a call</a></p>

<p>Best,<br>
The GovCon AI Team</p>
`
  },
  
  endingSoon: {
    subject: '⏰ Your GovCon AI Trial Ends Soon - Special Offer Inside!',
    body: (name, plan, daysRemaining, monthlyAmount) => `
<h2>Hi ${name},</h2>

<p>Your <strong>${plan}</strong> trial ends in <strong>${daysRemaining} days</strong>.</p>

<h3>🎁 Special Trial-to-Paid Offer:</h3>
<p><strong>Get 20% off your first 3 months</strong> when you upgrade before your trial ends!</p>

<h3>✅ What You'll Keep:</h3>
<ul>
  <li>24/7 SAM.gov monitoring</li>
  <li>FEMA & State EMA tracking</li>
  <li>Priority Slack notifications</li>
  <li>AI-powered search</li>
  <li>Unlimited contract tracking</li>
</ul>

<h3>💰 Your Investment:</h3>
<p>Regular price: <strong>$${monthlyAmount}/month</strong><br>
Your price: <strong>$${(monthlyAmount * 0.8).toFixed(2)}/month</strong> (first 3 months)</p>

<p><a href="#" style="background:#0070f3;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block;">Upgrade Now & Save 20%</a></p>

<p>Questions? <a href="#">Schedule a quick call</a> with our team.</p>

<p>Best regards,<br>
The GovCon AI Team</p>
`
  },
  
  lastDay: {
    subject: '🚨 Last Day of Your GovCon AI Trial!',
    body: (name, plan) => `
<h2>Hi ${name},</h2>

<p><strong>Today is the last day</strong> of your <strong>${plan}</strong> trial!</p>

<h3>⚡ Act Now to Keep Your Access:</h3>
<p>Don't lose access to your opportunity tracking and AI-powered contract intelligence.</p>

<p><a href="#" style="background:#ff0000;color:white;padding:15px 30px;text-decoration:none;border-radius:5px;display:inline-block;font-weight:bold;">Upgrade Now - 20% Off!</a></p>

<h3>What Happens If You Don't Upgrade:</h3>
<ul>
  <li>❌ You'll lose access to all tracking</li>
  <li>❌ No more Slack notifications</li>
  <li>❌ Can't track new opportunities</li>
</ul>

<p><strong>Still have questions?</strong> Reply now and we'll help!</p>

<p>Best,<br>
The GovCon AI Team</p>
`
  }
};

async function sendFollowUpEmails() {
  try {
    // Fetch all active trials
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Status',
        select: {
          equals: 'Active Trial'
        }
      }
    });

    const results = [];

    for (const page of response.results) {
      const email = page.properties['Customer Email']?.title[0]?.text?.content || '';
      const name = page.properties['Customer Name']?.rich_text[0]?.text?.content || email.split('@')[0];
      const plan = page.properties['Plan']?.select?.name || '';
      const amount = page.properties['Monthly Amount']?.number || 0;
      const daysRemaining = page.properties['Days Remaining']?.number || 0;
      const trialStarted = page.properties['Trial Started']?.date?.start || '';

      if (!email) continue;

      // Calculate trial day
      const startDate = new Date(trialStarted);
      const now = new Date();
      const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
      const totalTrialDays = 14; // Assuming 14-day trial
      const midPoint = Math.floor(totalTrialDays / 2);

      let emailType = null;
      let template = null;

      // Determine which email to send
      if (daysSinceStart === 0) {
        emailType = 'welcome';
        template = EMAIL_TEMPLATES.welcome;
      } else if (daysSinceStart === midPoint) {
        emailType = 'midTrial';
        template = EMAIL_TEMPLATES.midTrial;
      } else if (daysRemaining === 3) {
        emailType = 'endingSoon';
        template = EMAIL_TEMPLATES.endingSoon;
      } else if (daysRemaining === 1) {
        emailType = 'lastDay';
        template = EMAIL_TEMPLATES.lastDay;
      }

      if (emailType && template) {
        // Generate email content
        const subject = template.subject;
        const body = typeof template.body === 'function'
          ? template.body(name, plan, daysRemaining, amount)
          : template.body;

        results.push({
          email,
          name,
          plan,
          daysRemaining,
          emailType,
          subject,
          body,
          shouldSend: true
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Email automation error:', error);
    throw error;
  }
}

// Export for use in Node.js or as CLI
if (require.main === module) {
  sendFollowUpEmails()
    .then(emails => {
      console.log(JSON.stringify(emails, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { sendFollowUpEmails, EMAIL_TEMPLATES };
