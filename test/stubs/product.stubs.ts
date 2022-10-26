import { CreateProductDto, ProductDto } from '../../src/products/dtos';
import { ProductCategories } from '../../src/constants/products';
import { MongoIdOrString } from '../../src/common/interface';

interface Options {
  name: string;
  amount: number;
  price: number;
}
export const createProductStub = (
  options: Partial<Options> = {},
): CreateProductDto => {
  const { name, price, amount } = options;
  return {
    name: name || 'windows',
    amount: amount || 20,
    category: ProductCategories.BODY_PARTS,
    maximumStock: 200,
    price: price || 320,
  };
};
export const productStub = (
  id: MongoIdOrString,
  createdBy: MongoIdOrString,
): ProductDto => {
  return {
    name: 'windows',
    amount: 20,
    category: ProductCategories.BODY_PARTS,
    maximumStock: 200,
    price: 320,
    id: id.toString(),
    createdBy: createdBy.toString(),
  };
};
