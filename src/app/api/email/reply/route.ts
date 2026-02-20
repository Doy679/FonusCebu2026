import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing recipient or message' }, { status: 400 });
    }

    // SIMULATION: In a real app, use Nodemailer/Resend/SendGrid here.
    // For now, we simulate a delay and success.
    console.log(`[MOCK EMAIL] Sending to: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body: ${message}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
