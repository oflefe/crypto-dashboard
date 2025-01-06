import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { WebSocket } from './websocket.gateway';
import { SubscriptionService } from '../subscription/subscription.service';
import { TickerController } from './ticker.controller';

@Module({
  controllers: [TickerController],
  providers: [TickerService, WebSocket, SubscriptionService],
  exports: [TickerService],
})
export class TickerModule {}
