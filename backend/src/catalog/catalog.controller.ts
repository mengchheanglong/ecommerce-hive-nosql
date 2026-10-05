import { Controller, Get, Post, Delete, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { CatalogService } from "./catalog.service";
import { CreateProductDto } from "./dto/create-product.dto";

@ApiTags("Catalog Microservice (MongoDB)")
@Controller("api/products")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({ summary: "List products with optional category and search filters" })
  @ApiQuery({ name: "category", required: false, description: "Filter by category (Electronics, Clothing, Groceries)" })
  @ApiQuery({ name: "search", required: false, description: "Search keyword" })
  findAll(@Query("category") category?: string, @Query("search") search?: string) {
    return this.catalogService.findAll(category, search);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get single product by SKU / ID" })
  @ApiParam({ name: "id", example: "P2210" })
  findOne(@Param("id") id: string) {
    return this.catalogService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new product with polymorphic document schema in MongoDB" })
  create(@Body() dto: CreateProductDto) {
    return this.catalogService.create(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product by ID from MongoDB collection" })
  @ApiParam({ name: "id", example: "P2210" })
  delete(@Param("id") id: string) {
    return this.catalogService.delete(id);
  }
}
