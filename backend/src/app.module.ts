import { Module } from "@nestjs/common";
import { InventoryModule } from "./inventory/inventory.module";
import { DatabaseModule } from "./database/database.module";
import { CatalogModule } from "./catalog/catalog.module";
import { OrdersModule } from "./orders/orders.module";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { ReferralModule } from "./referral/referral.module";
import { WarehouseModule } from "./warehouse/warehouse.module";

@Module({
  imports: [
    DatabaseModule,
    InventoryModule,
    CatalogModule,
    OrdersModule,
    TelemetryModule,
    ReferralModule,
    WarehouseModule,
  ],
})
export class AppModule {}
