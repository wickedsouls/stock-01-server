import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { MongoIdOrString } from '../common/interface';
import { UpdateProductDto, CreateProductDto } from './dtos';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productRepo: Model<Product>,
  ) {}

  findAllProducts(): Promise<ProductDocument[]> {
    return this.productRepo.find({}).exec();
  }
  findProductById(id: MongoIdOrString): Promise<ProductDocument | null> {
    return this.productRepo.findById(id).exec();
  }
  findProductBy(key: string, value: string): Promise<ProductDocument | null> {
    return this.productRepo.findOne({ [key]: value }).exec();
  }
  createProduct(
    userId: MongoIdOrString,
    product: CreateProductDto,
  ): Promise<ProductDocument> {
    return this.productRepo.create({ ...product, createdBy: userId });
  }
  deleteProduct(id: MongoIdOrString) {
    return this.productRepo.deleteOne({ _id: id });
  }
  sortBy(key: string, direction: 'asc' | 'desc'): Promise<ProductDocument[]> {
    const ascending = direction === 'asc' ? 1 : -1;
    return this.productRepo
      .find({})
      .sort({ [key]: ascending })
      .exec();
  }
  filterBy(key: string, value: number | string): Promise<ProductDocument[]> {
    return this.productRepo.find({ [key]: value }).exec();
  }
  updateProduct(
    id: MongoIdOrString,
    data: UpdateProductDto,
  ): Promise<ProductDocument> {
    return this.productRepo.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
