import { NextResponse } from "next/server";
import { getRidersStore, updateRiderLocation } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const riders = getRidersStore(city || undefined);

  return NextResponse.json({
    success: true,
    totalRiders: 800,
    activeRiders: 642,
    pingsPerSecond: 160, // 800 riders / 5s = 160 writes/sec = 13.8M/day
    pingsPerDay: "13.8 Million",
    storageEngine: "Apache Cassandra (Column-Family LSM Tree)",
    keyspace: "telemetry_ks",
    table: "rider_gps_pings",
    riders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rider_id, lat, lng, speed, battery } = body;

    if (!rider_id || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing rider_id, lat, or lng" },
        { status: 400 }
      );
    }

    const updated = updateRiderLocation(rider_id, lat, lng, speed, battery);

    return NextResponse.json({
      success: true,
      message: `Ping recorded in Cassandra telemetry_ks.rider_gps_pings for ${rider_id}`,
      cql: `INSERT INTO rider_gps_pings (rider_id, ping_time, lat, lng, speed, battery) VALUES ('${rider_id}', toTimestamp(now()), '${lat}', '${lng}', '${speed || "25 km/h"}', ${battery || 85});`,
      rider: updated,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Invalid JSON ping payload" }, { status: 400 });
  }
}
