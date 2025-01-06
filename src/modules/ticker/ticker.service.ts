import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WebSocket } from './websocket.gateway';
import { BinanceWebSocket } from '../../common/utils/binance.utils';
import { SubscriptionService } from '../subscription/subscription.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TickerService implements OnModuleInit, OnModuleDestroy {
  private binanceWebSocket: BinanceWebSocket | null = null;
  private readonly binanceApiUrl: string;

  constructor(
    private readonly websocket: WebSocket,
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {
    this.binanceApiUrl = this.configService.get<string>('BINANCE_API_BASE_URL');
  }

  async onModuleInit() {
    this.binanceWebSocket = new BinanceWebSocket();
    await this.binanceWebSocket.connect((data) => {
     this.handleTickerData(data.data);
    });
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

  private handleTickerData(data: any) {
    const processedData = {
      symbol: data.s,
      price: data.c,
      high: data.h,
      low: data.l,
      change: data.p,
      percentChange: data.P,
      timestamp: Date.now(),
    };
    console.log('message received', processedData);
    this.websocket.sendTickerUpdate(processedData);
  }

  async getTopTradingPairs(): Promise<any[]> {
    const response = await axios.get(`${this.binanceApiUrl}/ticker/24hr`);
    return response.data.slice(0, 100).map((ticker: any) => ({
      symbol: ticker.symbol,
      priceChange: ticker.priceChange,
      priceChangePercent: ticker.priceChangePercent,
    }));
  }

  async getPairDetails(pair: string): Promise<any> {
    const response = await axios.get(
      `${this.binanceApiUrl}/ticker/24hr?symbol=${pair}`,
    );
    return {
      symbol: response.data.symbol,
      highPrice: response.data.highPrice,
      lowPrice: response.data.lowPrice,
      priceChange: response.data.priceChange,
      priceChangePercent: response.data.priceChangePercent,
    };
  }
}
