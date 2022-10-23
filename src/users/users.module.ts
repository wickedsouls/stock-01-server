import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema, User } from '../schemas/user.schema';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository, MongooseModule],
  imports: [
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
  ],
})
export class UsersModule {}
