import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userRepo: Model<User>) {}
  findAllUsers(): Promise<User[]> {
    return this.userRepo.find({}).exec();
  }
  findUserById(id: string | Types.ObjectId): Promise<User> {
    return this.userRepo.findById(id).exec();
  }
  findUserBy(key: string, value: string): Promise<User> {
    return this.userRepo.findOne({ [key]: value }).exec();
  }
  async createUser(data: CreateUserDto): Promise<User> {
    const user = await this.userRepo.create(data);
    return user.toObject();
  }
  deleteUser(id: string | Types.ObjectId) {
    return this.userRepo.deleteOne({ _id: id });
  }
}
