// app/api/serial/write/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialManager } from "../../../lib/serial-manager";

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json();

    if (!serialManager.isConnected()) {
      return NextResponse.json(
        { success: false, error: "Serial port not connected" },
        { status: 400 }
      );
    }

    await serialManager.write(data);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
