import { createProductStub } from '../../../test/stubs/product.stubs';

export const ProductsService = jest.fn().mockReturnValue({
  getAllProducts: jest.fn().mockResolvedValue([createProductStub()]),
  sortBy: jest.fn().mockResolvedValue([createProductStub()]),
  filterBy: jest.fn().mockResolvedValue([createProductStub()]),
  createProduct: jest.fn().mockResolvedValue(createProductStub()),
  deleteProduct: jest.fn().mockResolvedValue('123'),
  getProductById: jest.fn().mockResolvedValue(createProductStub()),
  updateProduct: jest.fn().mockResolvedValue(createProductStub()),
});
