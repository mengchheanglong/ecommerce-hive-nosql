import { Injectable, ServiceUnavailableException } from "@nestjs/common";

@Injectable()
export class TelemetryService {
  private riders = [
    { id: "R-101", name: "Chan Vuthy", city: "Phnom Penh", lat: 11.5564, lng: 104.9282, status: "Delivering", battery: 88, speed: "28 km/h" },
    { id: "R-102", name: "Sok Rith", city: "Phnom Penh", lat: 11.5721, lng: 104.915, status: "Picked Up", battery: 74, speed: "34 km/h" },
    { id: "R-103", name: "Meng Kiri", city: "Phnom Penh", lat: 11.543, lng: 104.939, status: "Idle", battery: 96, speed: "0 km/h" },
    { id: "R-201", name: "Thy Dara", city: "Siem Reap", lat: 13.3633, lng: 103.8564, status: "Delivering", battery: 62, speed: "22 km/h" },
    { id: "R-202", name: "Chea Bora", city: "Siem Reap", lat: 13.351, lng: 103.867, status: "Delivering", battery: 81, speed: "26 km/h" },
    { id: "R-301", name: "Heng Samnang", city: "Battambang", lat: 13.0957, lng: 103.2022, status: "Delivering", battery: 54, speed: "30 km/h" },
    { id: "R-302", name: "Keo Visal", city: "Battambang", lat: 13.102, lng: 103.194, status: "Idle", battery: 91, speed: "0 km/h" },
  ];

  async getFleetTelemetry(city?: string) {
    const list = city && city !== "All" ? this.riders.filter(r => r.city === city) : this.riders;
    return {
      schemaVersion: 1,
      success: true,
      source: "fixture",
      sourceId: "marketplace-demo-riders-v1",
      tenantId: "demo",
      status: "fixture",
      observedAt: null,
      storage: "none",
      durable: false,
      sinkOwner: "none",
      units: { coordinates: "degrees", speed: "km/h", battery: "percent" },
      metrics: {
        totalRiders: list.length,
        activeRiders: list.filter(r => r.status !== "Idle").length,
        connectedCouriers: 0,
        ingestRatePerSec: null,
        dailyWriteVolume: null,
        timeToLiveDays: null,
        sandboxSynced: false,
      },
      riders: list.map(r => ({ ...r })),
    };
  }

  recordPing(): never {
    throw new ServiceUnavailableException({
      schemaVersion: 1, success: false, source: "fixture", durable: false,
      stored: false, sinkOwner: "none",
      message: "GPS ingestion is disabled: no persistence sink is configured in this marketplace.",
    });
  }
}
