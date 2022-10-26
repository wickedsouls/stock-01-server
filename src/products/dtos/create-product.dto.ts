import { IsString, IsNumber, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { ProductCategories } from '../../constants/products';

export class CreateProductDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @Expose()
  @IsNumber()
  maximumStock;

  @Expose()
  @IsNumber()
  price;
}
