// app/api/serial/disconnect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialManager } from "../../../lib/serial-manager";

export async function POST(request: NextRequest) {
  try {
    await serialManager.disconnect();
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
