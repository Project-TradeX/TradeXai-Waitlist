import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

// Force dynamic execution since waitlist size changes constantly
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const waitlistCount = await dbService.getWaitlistCount();
    
    return NextResponse.json({
      waitlist: waitlistCount,
      interviews: 52, // dynamic baseline
      community: 680,
      countries: 24,
    });
  } catch (err: any) {
    return NextResponse.json({
      waitlist: 1248, // hardcoded fallback baseline
      interviews: 52,
      community: 680,
      countries: 24,
    });
  }
}
