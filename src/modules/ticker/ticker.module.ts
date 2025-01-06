import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { WebSocket } from './websocket.gateway';

@Module({
  providers: [TickerService, WebSocket],
  exports: [TickerService],
})
export class TickerModule {}
