import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { SupplyChainBridgeService } from "./supply-chain-bridge.service";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, SupplyChainBridgeService],
  exports: [OrdersService, SupplyChainBridgeService],
})
export class OrdersModule {}
