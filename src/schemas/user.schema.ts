import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../constants/users';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, unique: true, required: true })
  name;
  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role;
  @Prop({ type: String, required: true })
  password;
  @Prop({ type: Date, default: Date.now() })
  createdAt;
}

export const UserSchema = SchemaFactory.createForClass(User);
