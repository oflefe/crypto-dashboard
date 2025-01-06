import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto, SubscribeDto } from './validators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Post(':id/subscribe')
  subscribe(@Param('id') userId: string, @Body() dto: SubscribeDto) {
    return this.usersService.subscribeUser(parseInt(userId, 10), dto.symbol);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(parseInt(userId, 10));
  }

  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') userId: string, @Query('symbol') symbol: string) {
    return this.usersService.unsubscribeUser(parseInt(userId, 10), symbol);
  }

  @Get(':id/subscriptions')
  getSubscriptions(@Param('id') userId: string) {
    return this.usersService.getSubscriptions(parseInt(userId));
  }
}
