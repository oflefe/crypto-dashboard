import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TickerModule } from './modules/ticker/ticker.module';
import { RedisModule } from './common/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    TickerModule,
  ],
})
export class AppModule {}
