// app/api/daily-brief/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes

interface Customer {
  email: string;
  name: string;
  naicsCodes: string[];
  keywords: string[];
}

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-here';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Daily Brief] Starting daily brief generation...');

    // Step 1: Fetch customers from Google Sheets
    const customers = await fetchCustomers();
    console.log(`[Daily Brief] Found ${customers.length} customers`);

    if (customers.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No customers to process',
        emailsSent: 0
      });
    }

    // Step 2: Process each customer
    const results = [];
    for (const customer of customers) {
      try {
        // Search SAM.gov for this customer's criteria
        const searchResponse = await fetch(`${getBaseUrl()}/api/sam-gov/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            naicsCodes: customer.naicsCodes,
            keywords: customer.keywords,
            limit: 100
          })
        });

        if (!searchResponse.ok) {
          throw new Error(`Search failed: ${searchResponse.statusText}`);
        }

        const searchData = await searchResponse.json();
        const opportunities = searchData.opportunities || [];

        if (opportunities.length === 0) {
          console.log(`[Daily Brief] No opportunities for ${customer.email}`);
          results.push({ email: customer.email, status: 'no_opportunities' });
          continue;
        }

        // Send email
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const emailResponse = await fetch(`${getBaseUrl()}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: customer.email,
            subject: `GovCon Command Center - Daily Brief [${today}]`,
            opportunities: opportunities,
            customerName: customer.name
          })
        });

        if (!emailResponse.ok) {
          throw new Error(`Email failed: ${emailResponse.statusText}`);
        }

        console.log(`[Daily Brief] ✓ Sent brief to ${customer.email} (${opportunities.length} opps)`);
        results.push({ 
          email: customer.email, 
          status: 'sent', 
          opportunitiesCount: opportunities.length 
        });

      } catch (error: any) {
        console.error(`[Daily Brief] Error for ${customer.email}:`, error);
        results.push({ 
          email: customer.email, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;

    return NextResponse.json({
      success: true,
      message: `Processed ${customers.length} customers, sent ${successCount} emails`,
      emailsSent: successCount,
      results: results
    });

  } catch (error: any) {
    console.error('[Daily Brief] Fatal error:', error);
    return NextResponse.json(
      { error: error.message || 'Daily brief failed' },
      { status: 500 }
    );
  }
}

async function fetchCustomers(): Promise<Customer[]> {
  try {
    const sheetsUrl = process.env.GOOGLE_SHEETS_URL;
    if (!sheetsUrl) {
      throw new Error('GOOGLE_SHEETS_URL not configured');
    }

    const response = await fetch(sheetsUrl);
    if (!response.ok) {
      throw new Error(`Google Sheets fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse Google Sheets response
    // Expected format: { data: [ {email, name, naicsCodes, keywords}, ... ] }
    const rows = data.data || data || [];

    return rows.map((row: any) => ({
      email: row.email || row[1],
      name: row.name || row[0] || 'Customer',
      naicsCodes: parseArray(row.naicsCodes || row[2]),
      keywords: parseArray(row.keywords || row[3])
    })).filter((c: Customer) => c.email && c.naicsCodes.length > 0);

  } catch (error: any) {
    console.error('[Fetch Customers] Error:', error);
    return [];
  }
}

function parseArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
