import { NextResponse } from "next/server";

export async function GET() {
  const riders = [
    { id: "R-101", name: "Chan Vuthy", city: "Phnom Penh", lat: 11.5564, lng: 104.9282, status: "delivering", battery: 88, speed: "28 km/h" },
    { id: "R-102", name: "Sok Rith", city: "Phnom Penh", lat: 11.5721, lng: 104.9150, status: "picked_up", battery: 72, speed: "34 km/h" },
    { id: "R-103", name: "Meng Kiri", city: "Phnom Penh", lat: 11.5430, lng: 104.9390, status: "idle", battery: 95, speed: "0 km/h" },
    { id: "R-201", name: "Thy Dara", city: "Siem Reap", lat: 13.3633, lng: 103.8564, status: "delivering", battery: 64, speed: "22 km/h" },
    { id: "R-202", name: "Chea Bora", city: "Siem Reap", lat: 13.3510, lng: 103.8670, status: "delivering", battery: 81, speed: "26 km/h" },
    { id: "R-301", name: "Heng Samnang", city: "Battambang", lat: 13.0957, lng: 103.2022, status: "delivering", battery: 59, speed: "30 km/h" },
    { id: "R-302", name: "Keo Visal", city: "Battambang", lat: 13.1020, lng: 103.1940, status: "idle", battery: 90, speed: "0 km/h" },
  ];

  return NextResponse.json({
    success: true,
    totalRiders: 800,
    activeRiders: 642,
    pingsPerSecond: 160, // 800 riders / 5s = 160 writes/sec = 13.8M/day
    pingsPerDay: "13.8 Million",
    storageEngine: "Apache Cassandra (Column-Family)",
    riders,
  });
}
