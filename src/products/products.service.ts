import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ErrorMessages } from '../constants/errorMessages';
import { ValidateMongoId } from '../decorators/validateMongoId';
import { MongoIdOrString } from '../common/interface';
import { UpdateProductDto, CreateProductDto } from './dtos';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductRepository) {}

  getAllProducts() {
    return this.productsRepo.getAllProducts();
  }

  sortBy(key: string, direction: 'asc' | 'desc') {
    return this.productsRepo.sortBy(key, direction);
  }

  filterBy(key: string, value: string | number) {
    return this.productsRepo.filterBy(key, value);
  }

  @ValidateMongoId()
  async createProduct(
    userId: MongoIdOrString,
    createProductDto: CreateProductDto,
  ) {
    const { name } = createProductDto;
    const product = await this.productsRepo.getProductBy('name', name);
    if (product) {
      throw new BadRequestException(ErrorMessages.PRODUCT_ALREADY_EXISTS);
    }
    return await this.productsRepo.createProduct(userId, createProductDto);
  }

  @ValidateMongoId()
  async deleteProduct(productId: MongoIdOrString, userId: MongoIdOrString) {
    const product = await this.productsRepo.getProductById(productId);
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    if (userId.toString() !== product.createdBy.toString()) {
      throw new UnauthorizedException(ErrorMessages.IDS_DONT_MATCH);
    }
    return this.productsRepo.deleteProduct(productId);
  }

  @ValidateMongoId()
  async getProductById(id: MongoIdOrString) {
    const product = await this.productsRepo.getProductById(id);
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  @ValidateMongoId()
  async updateProduct(id: MongoIdOrString, data: UpdateProductDto) {
    const product = await this.productsRepo.getProductById(id);
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return this.productsRepo.updateProduct(id, data);
  }
}
