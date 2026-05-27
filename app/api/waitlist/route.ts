import { NextResponse } from "next/server";
import { WaitlistSchema } from "@/lib/schemas";
import { dbService } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Zod parse validation
    const parsedData = WaitlistSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, experience, challenge, tools, expectation, referredBy } = parsedData.data;

    // 2. Prevent duplicates check
    const isDuplicate = await dbService.checkDuplicateEmail(email);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "Email already registered on waitlist." },
        { status: 400 }
      );
    }

    // 3. Save into Neon PostgreSQL (or Mock fallback)
    const result = await dbService.insertWaitlist({
      email,
      experience,
      challenge,
      tools,
      expectation,
      referredBy,
    });

    // 4. Optional Resend Email Trigger
    // Runs in a safe try/catch block so a missing Resend API key never crashes the waitlist!
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://tradex.ai"}?ref=${result.referral_code}`;
        
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "TradeX Labs <founders@tradex.ai>",
            to: [email.toLowerCase()],
            subject: "Welcome to the TradeX Founding Waitlist",
            html: `
              <div style="font-family: sans-serif; background-color: #030605; color: #ecefed; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #00f5c4; font-size: 24px; margin-bottom: 20px;">Welcome to TradeX.</h1>
                <p style="font-size: 14px; line-height: 1.6; color: rgba(236,239,237,0.85);">We have successfully queued your application for the Founding Waitlist.</p>
                <p style="font-size: 14px; line-height: 1.6; color: rgba(236,239,237,0.85);">Your unique referral code is: <strong>${result.referral_code}</strong></p>
                <p style="font-size: 14px; line-height: 1.6; color: rgba(236,239,237,0.85);">To fast-track your batch approval status, invite friends using your unique referral link:</p>
                <div style="background-color: #060b09; border: 1px solid #12281e; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; margin: 20px 0; word-break: break-all;">
                  <a href="${referralUrl}" style="color: #00f5c4; text-decoration: none;">${referralUrl}</a>
                </div>
                <p style="font-size: 12px; color: rgba(236,239,237,0.45); margin-top: 30px;">Invite 3 people &rarr; priority batch queue bypass. Built publicly.</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Error triggering Resend email:", emailErr);
      }
    }

    return NextResponse.json(
      {
        message: "Successfully joined Founding Waitlist.",
        referral_code: result.referral_code,
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Waitlist API execution failure:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
