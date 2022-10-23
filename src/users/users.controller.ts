import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseInterceptors(new ResponseInterceptor(UserDto))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
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
  @Get('/name/:name')
  findUserByName(@Param('name') name: string) {
    return this.usersService.findUserByName(name);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
