import { IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateProductDto {
  @Expose()
  @IsNumber()
  amount: number;
}
