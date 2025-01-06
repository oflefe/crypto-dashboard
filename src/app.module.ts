import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TickerModule } from './ticker/ticker.module';
import { RedisModule } from './common/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    TickerModule,
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule {}
