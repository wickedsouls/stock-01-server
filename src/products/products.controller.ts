import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { ProductsService } from './products.service';
import { CurrentUserId } from '../decorators/currentUserId';
import { UpdateProductDto, CreateProductDto, ProductDto } from './dtos';

@UseGuards(JwtAuthGuard)
@UseInterceptors(new ResponseInterceptor(ProductDto))
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get('/all')
  findAllProducts() {
    return this.productsService.findAllProducts();
  }
  @Get('/filter')
  filterProductsBy(@Query('key') key: string, @Query('value') value: string) {
    return this.productsService.filterBy(key, value);
  }
  @Get('/sort')
  sortProductsByPrice(
    @Query('param') param: string,
    @Query('direction') direction: 'asc' | 'desc',
  ) {
    return this.productsService.sortBy(param, direction);
  }
  @Get('/:id')
  findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }
  @Post()
  createProduct(
    @Body() body: CreateProductDto,
    @CurrentUserId() userId: string,
  ) {
    return this.productsService.createProduct(userId, body);
  }
  @Delete('/:id')
  deleteProduct(
    @Param('id') productId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.productsService.deleteProduct(productId, userId);
  }
  @Put('/:id')
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.updateProduct(id, body);
  }
}
