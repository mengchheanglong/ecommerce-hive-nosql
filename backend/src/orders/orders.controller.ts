import { Controller, Get, Post, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto/create-order.dto";

@ApiTags("Orders Microservice (MongoDB)")
@Controller("api/orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "List customer orders sorted by creation date" })
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: "Create and persist new customer order" })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Put()
  @ApiOperation({ summary: "Advance order fulfillment state (Pending -> Preparing -> Out for Delivery -> Delivered)" })
  updateStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(dto);
  }
}
