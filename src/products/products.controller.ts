import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './products.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  @Header('Content-Type', 'application/json')
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string) {
    return this.productsService.getProduct(prodId);
  }

  @Post()
  @ApiBody({ type: CreateProductDto })
  addProduct(@Body() createProductDto: CreateProductDto) {
    const { title, description, price } = createProductDto;
    const returnId = this.productsService.insertProduct(
      title,
      description,
      price,
    );
    return { id: returnId, ...createProductDto };
  }

  @Put(':id')
  updateProduct(
    @Param('id') prodId: string,
    @Body() productData: CreateProductDto,
  ) {
    const updatedProduct = this.productsService.updateProduct(
      prodId,
      productData,
    );
    return updatedProduct;
  }

  @Patch(':id')
  partialUpdate(@Param('id') prodId: string, @Body() productData: Product) {
    const updatedProduct = this.productsService.partialUpdate(
      prodId,
      productData,
    );
    return updatedProduct;
  }
  @Delete(':id')
  deleteProduct(@Param('id') prodId: string) {
    this.productsService.deleteProduct(prodId);
    return { message: 'Product deleted' };
  }
}
