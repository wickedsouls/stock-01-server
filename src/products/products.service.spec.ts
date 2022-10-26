import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
  ProductSchema,
} from '../schemas/product.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ProductRepository } from './product.repository';
import { createProductStub, productStub } from '../../test/stubs/product.stubs';
import { ErrorMessages } from '../constants/errorMessages';

describe('ProductsService', () => {
  let service: ProductsService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let productsModel: Model<Product>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    productsModel = mongoConnection.model(Product.name, ProductSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ProductRepository,
        { provide: getModelToken(Product.name), useValue: productsModel },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  const id = new Types.ObjectId();

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create product', () => {
    it('should create new product', async () => {
      const product = await service.createProduct(id, createProductStub());
      expect(product).toBeDefined();
      expect(product.createdBy).toBe(id);
      expect(product.name).toBe(createProductStub().name);
    });
    it('should throw error creating same product', async () => {
      await productsModel.create({ ...createProductStub(), createdBy: id });
      await expect(
        service.createProduct(id, createProductStub()),
      ).rejects.toThrow(ErrorMessages.PRODUCT_ALREADY_EXISTS);
    });
    it('should throw error bad id is provided', async () => {
      await expect(() =>
        service.createProduct('123', createProductStub()),
      ).toThrow(ErrorMessages.INVALID_ID);
    });
  });

  describe('get products', () => {
    it('should get all products', async () => {
      await productsModel.create({ ...createProductStub(), createdBy: id });
      const products = await service.getAllProducts();
      expect(products.length).toBe(1);
      expect(products[0].name).toBe(createProductStub().name);
    });
    it('should product by id', async () => {
      const { _id } = await productsModel.create({
        ...createProductStub(),
        createdBy: id,
      });
      const product = await service.getProductById(_id);
      expect(product).toBeDefined();
      expect(product.name).toBe(createProductStub().name);
    });
    it('should throw error if product is not found', async () => {
      await productsModel.create({ ...createProductStub(), createdBy: id });
      await expect(() =>
        service.getProductById(new Types.ObjectId()),
      ).rejects.toThrow(ErrorMessages.PRODUCT_NOT_FOUND);
    });
    it('should sort product by', async () => {
      await productsModel.create({
        ...createProductStub({ name: 'a', price: 30 }),
        createdBy: id,
      });
      await productsModel.create({
        ...createProductStub({ name: 'b', price: 20 }),
        createdBy: id,
      });
      await productsModel.create({
        ...createProductStub({ name: 'c', price: 10 }),
        createdBy: id,
      });
      let products: ProductDocument[];
      products = await service.sortBy('price', 'asc');
      expect(products.length).toBe(3);
      expect(products[0].price).toBe(10);
      expect(products[2].price).toBe(30);
      products = await service.sortBy('price', 'desc');
      expect(products[0].price).toBe(30);
      expect(products[2].price).toBe(10);
    });
    it('should filter products by', async () => {
      await productsModel.create({
        ...createProductStub({ name: 'a', price: 10 }),
        createdBy: id,
      });
      await productsModel.create({
        ...createProductStub({ name: 'b', price: 20 }),
        createdBy: id,
      });
      await productsModel.create({
        ...createProductStub({ name: 'c', price: 10 }),
        createdBy: id,
      });
      const products = await service.filterBy('price', 10);
      expect(products.length).toBe(2);
      expect(products[0].price).toBe(10);
      expect(products[1].price).toBe(10);
    });
  });

  describe('delete product', () => {
    it('should delete product', async () => {
      const product = await productsModel.create({
        ...createProductStub(),
        createdBy: id,
      });
      await service.deleteProduct(product._id, id);
      const products = await productsModel.find({});
      expect(products.length).toBe(0);
    });
    it("should throw error deleting other user' product", async () => {
      const product = await productsModel.create({
        ...createProductStub(),
        createdBy: id,
      });
      const otherUserId = new Types.ObjectId();
      await expect(() =>
        service.deleteProduct(product._id, otherUserId),
      ).rejects.toThrow(ErrorMessages.IDS_DONT_MATCH);
    });
  });

  describe('update product', () => {
    it('should update product', async () => {
      const { _id } = await productsModel.create({
        ...createProductStub(),
        createdBy: id,
      });
      const product = await service.updateProduct(_id, { amount: 99 });
      expect(product.amount).toBe(99);
    });
    it('should throw error if product is not found', async () => {
      await productsModel.create({
        ...createProductStub(),
        createdBy: id,
      });
      await expect(() =>
        service.updateProduct(new Types.ObjectId(), { amount: 99 }),
      ).rejects.toThrow(ErrorMessages.PRODUCT_NOT_FOUND);
    });
  });
});
