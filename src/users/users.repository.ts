import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { MongoIdOrString } from '../common/interface';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userRepo: Model<User>) {}
  async findAllUsers(): Promise<UserDocument[]> {
    return this.userRepo.find({}).exec();
  }
  findUserById(id: MongoIdOrString): Promise<UserDocument | null> {
    return this.userRepo.findById(id).exec();
  }
  findUserBy(key: string, value: string): Promise<UserDocument> {
    return this.userRepo.findOne({ [key]: value }).exec();
  }
  async createUser(data: CreateUserDto): Promise<UserDocument> {
    return await this.userRepo.create(data);
  }
  deleteUser(id: MongoIdOrString) {
    return this.userRepo.deleteOne({ _id: id });
  }
}
