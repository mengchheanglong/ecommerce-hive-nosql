import { Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { TelemetryService } from "./telemetry.service";

@ApiTags("Demo telemetry fixtures")
@Controller("api/riders")
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  @ApiOperation({ summary: "Read labelled demo fixtures; no observed GPS or Cassandra metrics" })
  @ApiQuery({ name: "city", required: false })
  getFleetTelemetry(@Query("city") city?: string) {
    return this.telemetryService.getFleetTelemetry(city);
  }

  @Post("ping")
  @ApiOperation({ summary: "Disabled: no GPS persistence sink configured" })
  @ApiResponse({ status: 503, description: "Ping was not stored" })
  recordPing() {
    return this.telemetryService.recordPing();
  }
}
