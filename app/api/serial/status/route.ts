// app/api/serial/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialManager } from "../../../lib/serial-manager";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    connected: serialManager.isConnected(),
  });
}
