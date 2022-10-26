import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../schemas/product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository],
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ schema: ProductSchema, name: Product.name }]),
  ],
})
export class ProductsModule {}
