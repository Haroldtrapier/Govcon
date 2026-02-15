#!/usr/bin/env node
/**
 * TRIAL CONVERSION DASHBOARD
 * Analyzes trial data from Notion and generates conversion metrics
 */

const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = '30804926-7278-8126-9c82-fc859f80c7c4';

async function generateDashboard() {
  try {
    // Fetch all trial data
    const response = await notion.databases.query({
      database_id: DATABASE_ID
    });

    const trials = response.results.map(page => ({
      email: page.properties['Customer Email']?.title[0]?.text?.content || '',
      name: page.properties['Customer Name']?.rich_text[0]?.text?.content || '',
      plan: page.properties['Plan']?.select?.name || '',
      amount: page.properties['Monthly Amount']?.number || 0,
      status: page.properties['Status']?.select?.name || '',
      trialStarted: page.properties['Trial Started']?.date?.start || '',
      trialEnds: page.properties['Trial Ends']?.date?.start || '',
      daysRemaining: page.properties['Days Remaining']?.number || 0,
      convertedDate: page.properties['Converted Date']?.date?.start || '',
      canceledDate: page.properties['Canceled Date']?.date?.start || ''
    }));

    // Calculate metrics
    const total = trials.length;
    const converted = trials.filter(t => t.status.includes('Converted')).length;
    const canceled = trials.filter(t => t.status.includes('Canceled')).length;
    const active = trials.filter(t => t.status === 'Active Trial').length;

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
    const cancelRate = total > 0 ? ((canceled / total) * 100).toFixed(1) : 0;

    // Revenue calculations
    const convertedRevenue = trials
      .filter(t => t.status.includes('Converted'))
      .reduce((sum, t) => sum + t.amount, 0);

    const potentialRevenue = trials
      .filter(t => t.status === 'Active Trial')
      .reduce((sum, t) => sum + t.amount, 0);

    // Average days to convert
    const convertedTrials = trials.filter(t => t.convertedDate && t.trialStarted);
    const avgDaysToConvert = convertedTrials.length > 0
      ? convertedTrials.reduce((sum, t) => {
          const start = new Date(t.trialStarted);
          const end = new Date(t.convertedDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / convertedTrials.length
      : 0;

    // Plan breakdown
    const planBreakdown = {};
    trials.forEach(t => {
      if (!planBreakdown[t.plan]) {
        planBreakdown[t.plan] = { total: 0, converted: 0, active: 0, canceled: 0 };
      }
      planBreakdown[t.plan].total++;
      if (t.status.includes('Converted')) planBreakdown[t.plan].converted++;
      if (t.status === 'Active Trial') planBreakdown[t.plan].active++;
      if (t.status.includes('Canceled')) planBreakdown[t.plan].canceled++;
    });

    // Trials ending soon (next 3 days)
    const endingSoon = trials
      .filter(t => t.status === 'Active Trial' && t.daysRemaining <= 3)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    // Format dashboard
    const dashboard = {
      generated_at: new Date().toISOString(),
      overview: {
        total_trials: total,
        active_trials: active,
        converted: converted,
        canceled: canceled,
        conversion_rate: `${conversionRate}%`,
        cancel_rate: `${cancelRate}%`
      },
      revenue: {
        monthly_recurring_revenue: `$${convertedRevenue.toLocaleString()}`,
        potential_mrr: `$${potentialRevenue.toLocaleString()}`,
        total_potential: `$${(convertedRevenue + potentialRevenue).toLocaleString()}`
      },
      metrics: {
        avg_days_to_convert: avgDaysToConvert.toFixed(1),
        ending_soon_count: endingSoon.length
      },
      by_plan: Object.entries(planBreakdown).map(([plan, stats]) => ({
        plan,
        total: stats.total,
        converted: stats.converted,
        active: stats.active,
        canceled: stats.canceled,
        conversion_rate: stats.total > 0 ? `${((stats.converted / stats.total) * 100).toFixed(1)}%` : '0%'
      })),
      trials_ending_soon: endingSoon.map(t => ({
        email: t.email,
        name: t.name,
        plan: t.plan,
        days_remaining: t.daysRemaining,
        amount: `$${t.amount}`
      }))
    };

    return dashboard;
  } catch (error) {
    console.error('Dashboard generation error:', error);
    throw error;
  }
}

// Export for use in Node.js or as CLI
if (require.main === module) {
  generateDashboard()
    .then(dashboard => {
      console.log(JSON.stringify(dashboard, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { generateDashboard };
