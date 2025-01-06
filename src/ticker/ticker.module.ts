import { Module } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { WebSocket } from './websocket.gateway';
import { TickerController } from './ticker.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TickerController],
  providers: [TickerService, WebSocket],
  exports: [TickerService],
})
export class TickerModule {}
