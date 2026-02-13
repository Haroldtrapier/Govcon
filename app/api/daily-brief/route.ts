import { NextRequest, NextResponse } from 'next/server';

interface Customer {
  email: string;
  name: string;
  onboardingCompleted: boolean;
  naicsCodes: string[];
  keywords: string[];
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Daily Brief] Starting automation...');

    // Fetch customers from Google Sheets
    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
    if (!sheetsUrl) {
      throw new Error('Google Sheets URL not configured');
    }

    console.log('[Daily Brief] Fetching customers from Google Sheets...');
    const sheetsResponse = await fetch(sheetsUrl);

    if (!sheetsResponse.ok) {
      throw new Error(`Failed to fetch customers: ${sheetsResponse.statusText}`);
    }

    const customersData = await sheetsResponse.json();
    const customers: Customer[] = customersData.customers || [];

    console.log(`[Daily Brief] Found ${customers.length} total customers`);

    // Filter for onboarded customers
    const onboardedCustomers = customers.filter(c => c.onboardingCompleted);
    console.log(`[Daily Brief] Processing ${onboardedCustomers.length} onboarded customers`);

    // Get today's date for filtering (LIVE data)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const results = [];

    // Process each customer
    for (const customer of onboardedCustomers) {
      console.log(`[Daily Brief] Processing: ${customer.name} (${customer.email})`);

      try {
        // Search SAM.gov for this customer
        const searchResponse = await fetch(`${request.nextUrl.origin}/api/sam-gov/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            naicsCodes: customer.naicsCodes || [],
            keywords: customer.keywords || [],
            postedFrom: todayStr, // TODAY'S opportunities
            postedTo: todayStr,
            limit: 10
          })
        });

        if (!searchResponse.ok) {
          throw new Error(`SAM.gov search failed: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();
        const opportunities = searchData.opportunities || [];

        console.log(`[Daily Brief] Found ${opportunities.length} opportunities for ${customer.name}`);

        // Generate email HTML
        const emailHtml = generateEmailHtml(customer, opportunities, today);

        // Send email
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: customer.email,
            subject: `GovCon Command Center - Daily Brief [${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}]`,
            html: emailHtml
          })
        });

        if (!emailResponse.ok) {
          throw new Error(`Email send failed: ${emailResponse.statusText}`);
        }

        const emailData = await temailResponse.json();
        results.push({
          customer: customer.email,
          success: true,
          opportunitiesFound: opportunities.length,
          messageId: emailData.messageId
        });

        console.log(`[Daily Brief] ✅ Sent to ${customer.email}`);

      } catch (error) {
        console.error(`[Daily Brief] ❌ Error for ${customer.email}:`, error);
        results.push({
          customer: customer.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('[Daily Brief] Automation completed');

    return NextResponse.json({
      success: true,
      totalCustomers: onboardedCustomers.length,
      results
    });

  } catch (error) {
    console.error('[Daily Brief] Fatal error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
