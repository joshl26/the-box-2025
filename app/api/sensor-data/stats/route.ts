import { NextRequest } from "next/server";
import { fetchSensorStats } from "@/app/actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sensorId = searchParams.get("sensorId");
  const hoursBack = searchParams.get("hoursBack");

  if (!sensorId) {
    return Response.json({ success: false, error: "Sensor ID is required" });
  }

  const result = await fetchSensorStats(
    parseInt(sensorId),
    hoursBack ? parseInt(hoursBack) : 24
  );

  return Response.json(result);
}
