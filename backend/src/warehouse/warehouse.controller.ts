import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
import { WarehouseService } from "./warehouse.service";

@ApiTags("Warehouse Microservice (Apache Hive on HDFS)")
@Controller("api/analytics")
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  @ApiOperation({ summary: "Get aggregated sales reporting & warehouse pipeline metrics" })
  getWarehouseAnalytics() {
    return this.warehouseService.getWarehouseAnalytics();
  }

  @Get("query/:queryId")
  @ApiOperation({ summary: "Simulate HiveQL query execution (D1, D2, D3, D4)" })
  @ApiParam({ name: "queryId", example: "D1", description: "Query ID (D1, D2, D3, or D4)" })
  executeQuery(@Param("queryId") queryId: string) {
    return this.warehouseService.executeSampleQuery(queryId);
  }
}
