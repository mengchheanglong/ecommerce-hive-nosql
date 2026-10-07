import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { CatalogService } from "./catalog.service";
import { CreateProductDto } from "./dto/create-product.dto";

@ApiTags("Catalog Microservice (MongoDB)")
@Controller("api/products")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @ApiOperation({ summary: "List products with optional category, subcategory, and search filters" })
  @ApiQuery({ name: "category", required: false, description: "Filter by category name or slug" })
  @ApiQuery({ name: "subcategory", required: false, description: "Filter by subcategory slug" })
  @ApiQuery({ name: "search", required: false, description: "Search keyword" })
  findAll(
    @Query("category") category?: string,
    @Query("subcategory") subcategory?: string,
    @Query("search") search?: string
  ) {
    return this.catalogService.findAll(category, search, subcategory);
  }

  @Get("meta/counts")
  @ApiOperation({ summary: "Get live aggregate product counts by category and subcategory" })
  getCategoryCounts() {
    return this.catalogService.getCategoryCounts();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get single product by SKU / ID" })
  @ApiParam({ name: "id", example: "P2210" })
  findOne(@Param("id") id: string) {
    return this.catalogService.findOne(id);
  }

  @Post("adjust-stock")
  @ApiOperation({ summary: "Adjust inventory stock for items (used by fulfillment & logistics simulation)" })
  adjustStock(@Body() body: { items: Array<{ product_id: string; quantity: number }> }) {
    return this.catalogService.adjustStock(body.items || []);
  }

  @Post()
  @ApiOperation({ summary: "Create a new product with polymorphic document schema in MongoDB" })
  create(@Body() dto: CreateProductDto) {
    return this.catalogService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update product attributes in MongoDB collection" })
  @ApiParam({ name: "id", example: "P2210" })
  update(@Param("id") id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.catalogService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete product by ID from MongoDB collection" })
  @ApiParam({ name: "id", example: "P2210" })
  delete(@Param("id") id: string) {
    return this.catalogService.delete(id);
  }
}
