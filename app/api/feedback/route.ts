import { NextResponse } from "next/server";
import { FeedbackSchema } from "@/lib/schemas";
import { dbService } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod parse validation
    const parsedData = FeedbackSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, type, message } = parsedData.data;

    // Save into Neon PostgreSQL (or Mock fallback)
    const result = await dbService.insertFeedback({
      name,
      email,
      type,
      message,
    });

    return NextResponse.json(
      {
        message: "Feedback submitted successfully.",
        id: result.id,
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Feedback API execution failure:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
