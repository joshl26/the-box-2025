import { NextRequest } from "next/server";
import { fetchSensorData } from "@/app/actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sensorId = searchParams.get("sensorId");
  const hoursBack = searchParams.get("hoursBack");

  //   console.log(sensorId);

  const result = await fetchSensorData(
    sensorId ? parseInt(sensorId) : undefined,
    hoursBack ? parseInt(hoursBack) : 24
  );

  return Response.json(result);
}
