import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/all')
  getAllUsers() {
    return 'List of all users';
  }
  @Post()
  createUser(@Body() body: any) {
    console.log(body);
    return 'User created';
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    console.log(id);
    return 'User deleted';
  }
}
