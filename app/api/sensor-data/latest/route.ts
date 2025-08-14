import { NextRequest } from "next/server";
import { fetchLatestSensorReading } from "@/app/actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sensorId = searchParams.get("sensorId");

  if (!sensorId) {
    return Response.json({ success: false, error: "Sensor ID is required" });
  }

  const result = await fetchLatestSensorReading(parseInt(sensorId));
  return Response.json(result);
}
