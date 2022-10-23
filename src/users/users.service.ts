import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import { ErrorMessages } from '../constants/errorMessages';
import { ValidateMongoId } from '../decorators/validateMongoId';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name } = createUserDto;
    const user = await this.userRepo.findUserBy('name', name);
    if (user) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_EXISTS);
    }
    return this.userRepo.createUser(createUserDto);
  }

  findAllUsers() {
    return this.userRepo.findAllUsers();
  }

  @ValidateMongoId()
  async findUserById(id: Types.ObjectId | string) {
    const user = await this.userRepo.findUserById(id);
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }

  @ValidateMongoId()
  async deleteUser(id: Types.ObjectId | string) {
    const user = await this.userRepo.findUserById(id);
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    await this.userRepo.deleteUser(id);
    return id;
  }

  async findUserByName(name: string) {
    const user = await this.userRepo.findUserBy('name', name);
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }
    return user;
  }
}
