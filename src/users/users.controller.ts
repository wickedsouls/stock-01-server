import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { UserDto } from './dtos/user.dto';

@UseInterceptors(new ResponseInterceptor(UserDto))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/all')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }
  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
