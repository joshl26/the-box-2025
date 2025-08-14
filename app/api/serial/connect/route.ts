// app/api/serial/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialManager, type SerialConfig } from "../../../lib/serial-manager";

interface ConnectRequestBody {
  port: string;
  baudRate?: number;
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 2;
  parity?: "none" | "even" | "odd" | "mark" | "space";
}

interface ConnectResponse {
  success: boolean;
  error?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ConnectResponse>> {
  try {
    const body: ConnectRequestBody = await request.json();
    console.log(body);
    if (!body.port) {
      return NextResponse.json(
        { success: false, error: "Port path is required" },
        { status: 400 }
      );
    }

    const config: SerialConfig = {
      path: body.port,
      baudRate: body.baudRate || 9600,
      dataBits: body.dataBits,
      stopBits: body.stopBits,
      parity: body.parity,
    };

    await serialManager.connect(config);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Serial connection error:", error);

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
