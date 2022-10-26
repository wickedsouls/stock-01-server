import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { createProductStub } from '../../test/stubs/product.stubs';

jest.mock('./products.service.ts');

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should call get all products service', async () => {
    const products = await service.findAllProducts();
    expect(products.length).toBe(1);
  });
  it('should call sort products service', async () => {
    const products = await service.sortBy('name', 'asc');
    expect(products.length).toBe(1);
  });
  it('should call filter products service', async () => {
    const products = await service.filterBy('name', 'windows');
    expect(products.length).toBe(1);
  });
  it('should call create product service', async () => {
    const product = await service.createProduct('userId', createProductStub());
    expect(product).toBeDefined();
  });
  it('should call update product service', async () => {
    const product = await service.updateProduct('userId', createProductStub());
    expect(product).toBeDefined();
  });
  it('should call get product by id service', async () => {
    const product = await service.findProductById('id');
    expect(product).toBeDefined();
  });
  it('should call delete product service', async () => {
    const product = await service.deleteProduct('id', 'user id');
    expect(product).toBeDefined();
  });
});
