import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WebSocket } from './websocket.gateway';
import { BinanceWebSocket } from '../../common/utils/binance.utils';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class TickerService implements OnModuleInit, OnModuleDestroy {
  private binanceWebSocket: BinanceWebSocket | null = null;

  constructor(
    private readonly websocket: WebSocket,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  onModuleInit() {
    this.binanceWebSocket = new BinanceWebSocket();
    this.binanceWebSocket.connect((data) => this.handleTickerData(data));
  }

  onModuleDestroy() {
    this.binanceWebSocket?.disconnect();
  }

  async subscribeUser(userId: string, pair: string) {
    await this.subscriptionService.addUserSubscription(userId, pair);
    this.binanceWebSocket?.addPair(pair);
  }

  async unsubscribeUser(userId: string, pair: string) {
    await this.subscriptionService.removeUserSubscription(userId, pair);
    this.binanceWebSocket?.removePair(pair);
  }

  private async handleTickerData(data: any) {
    const processedData = {
      symbol: data.s,
      price: data.c,
      high: data.h,
      low: data.l,
      change: data.p,
      percentChange: data.P,
      timestamp: Date.now(),
    };

    const userIds = await this.subscriptionService.getUsersSubscribedToPair(
      processedData.symbol,
    );
    userIds.forEach((userId) => {
      this.websocket.sendTickerUpdate({ userId, ...processedData });
    });
  }
}
