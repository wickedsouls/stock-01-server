import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductCategories } from '../constants/products';
import { User } from './user.schema';

export type ProductDocument = Document & Product;

@Schema()
export class Product {
  @Prop({ type: String, required: true, unique: true })
  name;
  @Prop({ type: Number, required: true })
  amount;
  @Prop({ type: String, enum: ProductCategories, required: true })
  category;
  @Prop({ type: Number, required: true })
  maximumStock;
  @Prop({ type: Number, required: true })
  price;
  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
