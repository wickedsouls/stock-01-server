import { createProductStub } from '../../../test/stubs/product.stubs';

export const ProductsService = jest.fn().mockReturnValue({
  findAllProducts: jest.fn().mockResolvedValue([createProductStub()]),
  sortBy: jest.fn().mockResolvedValue([createProductStub()]),
  filterBy: jest.fn().mockResolvedValue([createProductStub()]),
  createProduct: jest.fn().mockResolvedValue(createProductStub()),
  deleteProduct: jest.fn().mockResolvedValue('123'),
  findProductById: jest.fn().mockResolvedValue(createProductStub()),
  updateProduct: jest.fn().mockResolvedValue(createProductStub()),
});
