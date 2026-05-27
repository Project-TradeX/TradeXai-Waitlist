import { NextResponse } from "next/server";
import { TerminalSchema } from "@/lib/schemas";
import { dbService } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod validation
    const parsedData = TerminalSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Validation failed.", details: parsedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, message } = parsedData.data;

    // Save terminal message
    const result = await dbService.insertTerminalMessage(email, message);

    return NextResponse.json(
      {
        message: "Terminal message transmitted.",
        id: result.id,
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error("Terminal API execution failure:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
