// app/api/serial/ports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SerialManager } from "../../../lib/serial-manager";

interface PortsResponse {
  success: boolean;
  ports?: Array<{
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    pnpId?: string;
    locationId?: string;
    productId?: string;
    vendorId?: string;
  }>;
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<PortsResponse>> {
  try {
    const ports = await SerialManager.listPorts();

    return NextResponse.json({
      success: true,
      ports: ports,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error listing serial ports:", error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
