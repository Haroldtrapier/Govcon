// app/api/email/send/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface EmailParams {
  to: string;
  subject: string;
  opportunities: any[];
  customerName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, opportunities, customerName = 'Valued Customer' }: EmailParams = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
    }

    // Generate email HTML
    const html = generateEmailHTML(opportunities, customerName);

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'GovCon Command Center <info@trapiermanagement.com>',
        to: [to],
        subject: subject,
        html: html
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      messageId: data.id
    });

  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(opportunities: any[], customerName: string): string {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const topOpps = opportunities.slice(0, 10);
  const highPriority = opportunities.filter(o => isHighPriority(o)).length;
  const critical = opportunities.filter(o => isCritical(o)).length;

  const opportunitiesHTML = topOpps.map((opp, index) => `
    <div style="margin-bottom: 24px; padding: 16px; background: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #111827;">
        ${index + 1}. [${opp.type || 'Opportunity'}] ${opp.solicitationNumber || 'N/A'}: ${opp.title}
      </h3>
      <p style="margin: 4px 0; font-size: 14px; color: #6b7280;">
        <strong>Agency:</strong> ${opp.agency}
      </p>
      <p style="margin: 4px 0; font-size: 14px; color: #6b7280;">
        <strong>Due:</strong> ${opp.responseDeadline ? new Date(opp.responseDeadline).toLocaleDateString() : 'TBD'}
      </p>
      <p style="margin: 8px 0; font-size: 14px; color: #374151; line-height: 1.6;">
        ${opp.description || 'No description available'}
      </p>
      <a href="${opp.link}" style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">
        View on SAM.gov
      </a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #ffffff;">
      <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #111827;">
            GovCon Command Center ENHANCED - Daily Update
          </h1>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">${today}</p>
        </div>

        <div style="margin-bottom: 32px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
          <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #1e40af;">📊 SUMMARY:</h2>
          <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
            <li>Total Opportunities: ${opportunities.length}</li>
            <li>High Priority (8+): ${highPriority}</li>
            <li>Critical (9-10): ${critical}</li>
          </ul>
        </div>

        <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">🔥 TOP 10 OPPORTUNITIES:</h2>

        ${opportunitiesHTML}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} GovCon Command Center. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function isHighPriority(opp: any): boolean {
  // Simple scoring: check if deadline is within 14 days
  if (!opp.responseDeadline) return false;
  const deadline = new Date(opp.responseDeadline);
  const daysUntil = Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysUntil > 0 && daysUntil <= 14;
}

function isCritical(opp: any): boolean {
  // Critical: deadline within 7 days
  if (!opp.responseDeadline) return false;
  const deadline = new Date(opp.responseDeadline);
  const daysUntil = Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysUntil > 0 && daysUntil <= 7;
}
