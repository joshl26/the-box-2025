// app/api/serial/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialManager } from "../../../lib/serial-manager";

interface SendRequestBody {
  command: {
    action: string;
    pin: number;
    duration: number;
  };
}

interface SendResponse {
  success: boolean;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SendResponse>> {
  try {
    const body: SendRequestBody = await request.json();
    console.log(body);
    if (!body.command) {
      return NextResponse.json(
        { success: false, error: "Command is required" },
        { status: 400 }
      );
    }

    if (!serialManager.isConnected()) {
      return NextResponse.json(
        { success: false, error: "Serial port not connected" },
        { status: 400 }
      );
    }

    // Convert command to JSON string for transmission
    const commandString = JSON.stringify(body.command) + "\n";

    await serialManager.write(commandString);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Serial send error:", error);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
