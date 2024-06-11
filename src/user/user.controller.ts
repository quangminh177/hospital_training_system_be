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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetCurrentUser } from '../common/decorators';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { Tokens } from 'src/auth/types';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUser() user: User) {
    delete user.hash;
    delete user.hashedRt;
    return user;
  }

  @Patch('profile/editProfile')
  @HttpCode(HttpStatus.OK)
  async editProfile(@GetCurrentUser() user: User, @Body() dto: EditUserDto) {
    return await this.userService.editProfile(user, dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers(
    @Query()
    querry: {
      page: number;
      size: number;
      role: Role;
      keyword: string;
    },
  ) {
    return await this.userService.getUsers(querry);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.getUserById(userId);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createUser')
  createUser(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.userService.createUser(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editUser/:id')
  async editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return await this.userService.editUserById(userId, dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteUser/:id')
  async deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return await this.userService.deleteUserById(userId);
  }
}
