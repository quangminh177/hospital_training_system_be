import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { Tokens } from 'src/auth/types';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser() user: User) {
    return user;
  }

  @Patch('profile/editProfile')
  @HttpCode(HttpStatus.OK)
  editProfile(@GetCurrentUserId() userId: number, @Body() dto: EditUserDto) {
    return this.userService.editProfile(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('createUser')
  createUser(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.userService.createUser(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('editUser/:id')
  editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUserById(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('deleteUser/:id')
  deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUserById(userId);
  }
}
