import {
  Controller,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseInterceptor } from '../interceptor/response.interceptor';
import { UserDto } from './dtos/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../decorators/currentUserId';

@UseGuards(JwtAuthGuard)
@UseInterceptors(new ResponseInterceptor(UserDto))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/all')
  findAllUsers() {
    return this.usersService.findAllUsers();
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
  deleteUser(@Param('id') id: string, @CurrentUserId() currentUserId: string) {
    return this.usersService.deleteUser(id, currentUserId);
  }
}
