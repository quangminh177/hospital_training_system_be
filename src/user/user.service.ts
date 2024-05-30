import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Tokens } from 'src/auth/types';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getUsers(querry: {
    page: number;
    size: number;
    role: Role;
    keyword: string;
  }) {
    try {
      const { page, size, role, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let users: User[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;
        users = await this.prisma.user.findMany({
          take: +take,
          skip: skip,
          where: {
            isDeleted: false,
            email: {
              contains: keyword,
              mode: 'insensitive',
            },
            role: role,
          },
        });

        users.map((user) => delete user.hashedRt);
      } else {
        users = await this.prisma.user.findMany({
          where: {
            isDeleted: false,
            email: {
              contains: keyword,
              mode: 'insensitive',
            },
            role: role,
          },
        });
      }
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

  async editProfile(userDetail: User, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userDetail.id,
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
