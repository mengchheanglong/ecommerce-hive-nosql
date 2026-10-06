import { Controller, Get, Post, Put, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam } from "@nestjs/swagger";
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

  @Get(":id")
  @ApiOperation({ summary: "Get single order by order_id" })
  @ApiParam({ name: "id", example: "ORD-100001" })
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
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
