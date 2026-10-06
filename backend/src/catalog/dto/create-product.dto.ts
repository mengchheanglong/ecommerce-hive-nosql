import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive, Min, IsArray } from "class-validator";

export class CreateProductDto {
  @ApiPropertyOptional({ example: "P2210" })
  @IsOptional()
  @IsString()
  product_id?: string;

  @ApiProperty({ example: "Ultra Smartphone Pro Max" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: "Food & Groceries",
    enum: [
      "Electronics",
      "Clothing",
      "Groceries",
      "Food & Groceries",
      "Fashion & Accessories",
      "Home & Living",
      "Beauty & Wellness",
      "Arts & Culture",
    ],
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ example: 289.0 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: "Price must be a positive number greater than zero" })
  price: number;

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: "Stock cannot be negative" })
  stock?: number;

  @ApiPropertyOptional({ example: "active" })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: "6.7 inch OLED" })
  @IsOptional()
  @IsString()
  screen_size?: string;

  @ApiPropertyOptional({ example: "1 Year Official" })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ example: "L" })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ example: ["Navy Blue", "Sand Beige"] })
  @IsOptional()
  @IsArray()
  colours?: string[];

  @ApiPropertyOptional({ example: "5.0 kg" })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiPropertyOptional({ example: "2027-10-01" })
  @IsOptional()
  @IsString()
  expiry_date?: string;

  @ApiPropertyOptional({ example: "24cm x 18cm x 12cm" })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ example: "Natural Terracotta Clay" })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ example: "50ml Bottle" })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({ example: "All Skin Types" })
  @IsOptional()
  @IsString()
  skin_type?: string;

  @ApiPropertyOptional({ example: "Kampong Chhnang Artisan Guild" })
  @IsOptional()
  @IsString()
  artisan?: string;

  @ApiPropertyOptional({ example: "Kampong Chhnang" })
  @IsOptional()
  @IsString()
  origin_province?: string;

  @ApiPropertyOptional({ example: "food-groceries" })
  @IsOptional()
  @IsString()
  category_slug?: string;

  @ApiPropertyOptional({ example: ["Groceries", "Food"] })
  @IsOptional()
  @IsArray()
  category_aliases?: string[];

  @ApiPropertyOptional({ example: "rice-grains" })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiPropertyOptional({ example: "Rice & Grains" })
  @IsOptional()
  @IsString()
  subcategory_name?: string;

  @ApiPropertyOptional({ example: "Flagship AMOLED display with high-efficiency 5G modem." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ["P2211", "P2215"] })
  @IsOptional()
  @IsArray()
  frequently_bought_with?: string[];

  @ApiPropertyOptional({ example: "https://example.com/image.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: ["https://example.com/1.jpg"] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  reviews_count?: number;

  @ApiPropertyOptional({ example: [] })
  @IsOptional()
  @IsArray()
  reviews?: any[];
}
