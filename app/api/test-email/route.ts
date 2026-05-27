import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'founders@tradexai.tech',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "An unexpected error occurred" }, { status: 500 });
  }
}
