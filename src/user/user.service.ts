import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Tokens } from 'src/auth/types';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();

      users.map((user) => delete user.hashedRt);
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      delete user.hash;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(dto: CreateUserDto): Promise<Tokens> {
    try {
      return this.authService.signup(dto);
    } catch (error) {
      throw error;
    }
  }

  async editProfile(userId: number, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      delete user.hash;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async editUserById(userId: number, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      delete user.hash;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserById(userId: number) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isDeleted: true,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
