import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { to, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    console.log('[Email] Sending to:', to);

    const { data, error } = await resend.emails.send({
      from: 'GovCon Command Center <info@trapiermanagement.com>',
      to: [to],
      subject,
      html
    });

    if (error) {
      console.error('[Email] Send error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('[Email] Sent successfully:', data);

    return NextResponse.json({
      success: true,
      messageId: data?.id
    });

  } catch (error) {
    console.error('[Email] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
