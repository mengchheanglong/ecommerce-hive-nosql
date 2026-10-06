import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @ApiPropertyOptional({ example: "ORD-100001" })
  @IsOptional()
  @IsString()
  order_id?: string;

  @ApiPropertyOptional({ example: "C0457" })
  @IsOptional()
  @IsString()
  customer_id?: string;

  @ApiProperty({ example: "Sokha Meas" })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({
    example: [{ product_id: "P2210", name: "Ultra Smartphone Pro Max", quantity: 1, price: 289.0 }],
  })
  @IsNotEmpty()
  items: Array<{ product_id: string; name: string; quantity: number; price: number }>;

  @ApiProperty({ example: 289.0 })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({ example: "Phnom Penh" })
  @IsNotEmpty()
  @IsString()
  province: string;

  @ApiProperty({ example: "Bakong KHQR" })
  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @ApiPropertyOptional({ example: "Pending" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: "Street 271, Sangkat Boeung Tumpun" })
  @IsOptional()
  @IsString()
  delivery_address?: string;

  @ApiPropertyOptional({ example: "R-101" })
  @IsOptional()
  @IsString()
  assigned_courier_id?: string;

  @ApiPropertyOptional({ example: "Chan Vuthy" })
  @IsOptional()
  @IsString()
  assigned_courier_name?: string;

  @ApiPropertyOptional({ example: "+855 12 999 888" })
  @IsOptional()
  @IsString()
  courier_phone?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ example: "ORD-100001" })
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty({ example: "Out for Delivery", enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"] })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: "R-101" })
  @IsOptional()
  @IsString()
  courier_id?: string;
}
