import { Controller, Get, Post, Query, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { TelemetryService } from "./telemetry.service";

@ApiTags("Telemetry Microservice (Apache Cassandra)")
@Controller("api/riders")
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  @ApiOperation({ summary: "Get live fleet telemetry and Cassandra ingest metrics (160 writes/sec)" })
  @ApiQuery({ name: "city", required: false, description: "Filter by city (Phnom Penh, Siem Reap, Battambang)" })
  async getFleetTelemetry(@Query("city") city?: string) {
    return await this.telemetryService.getFleetTelemetry(city);
  }

  @Post("ping")
  @ApiOperation({ summary: "Ingest GPS location ping into Cassandra rider_gps_pings table" })
  recordPing(
    @Body()
    body: {
      rider_id: string;
      lat: number;
      lng: number;
      speed: string;
      battery: number;
      status?: string;
      name?: string;
      city?: string;
    }
  ) {
    return this.telemetryService.recordPing(
      body.rider_id,
      body.lat,
      body.lng,
      body.speed,
      body.battery,
      body.status,
      body.name,
      body.city
    );
  }
}
