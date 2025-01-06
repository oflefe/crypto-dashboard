import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TickerModule } from './modules/ticker/ticker.module';
import { RedisModule } from './common/redis.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    TickerModule,
    PrismaModule,
  ],
})
export class AppModule {}
