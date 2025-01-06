import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './validators';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { message: 'Login successful', id: user.id };
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async subscribeUser(userId: number, symbol: string) {
    const subscription = this.prisma.subscription.findFirst({
      where: {
        userId,
        symbol,
      },
    });
    if (subscription) {
      return {
        message: 'User is already subscribed',
      };
    }
    return this.prisma.subscription.create({
      data: {
        userId,
        symbol,
      },
    });
  }

  async unsubscribeUser(userId: number, symbol: string) {
    return this.prisma.subscription.deleteMany({
      where: {
        userId,
        symbol,
      },
    });
  }

  async getSubscriptions(userId: number) {
    return this.prisma.subscription.findMany({
      where: { userId },
    });
  }
}
