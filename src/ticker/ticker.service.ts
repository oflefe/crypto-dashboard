import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { WebSocket } from './websocket.gateway';
import { BinanceWebSocket } from '../common/utils/binance.utils';
import axios from 'axios';

@Injectable()
export class TickerService implements OnModuleInit, OnModuleDestroy {
  private binanceWebSocket: BinanceWebSocket;

  constructor(private readonly websocket: WebSocket) {
    this.binanceWebSocket = new BinanceWebSocket();
  }

  async onModuleInit() {
    // Fetch 100 symbols and start tracking
    const symbols = await this.fetchTopSymbols();
    this.binanceWebSocket.updateTrackedSymbols(
      symbols.map((symbol) => symbol.symbol),
    );

    // Handle real-time updates from Binance
    this.binanceWebSocket.connect((data) => this.handleTickerData(data));
  }

  async onModuleDestroy() {
    this.binanceWebSocket.disconnect();
  }

  async fetchTopSymbols(): Promise<{ symbol: string; price: number }[]> {
    const response = await axios.get(
      'https://api.binance.com/api/v3/ticker/price',
    );
    return response.data
      .slice(0, 100)
      .map((ticker: any) => ({ symbol: ticker.symbol, price: ticker.price }));
  }

  private handleTickerData(data: any) {
    const {
      s: symbol,
      c: price,
      h: highPrice,
      l: lowPrice,
      p: priceChange,
      P: percentChange,
    } = data;
    this.websocket.broadcast('homepage', { symbol, price });
    this.websocket.broadcastSubscribedUsers(symbol, price);
    this.websocket.broadcastSymbolDetails(symbol, {
      symbol,
      price,
      high: highPrice,
      low: lowPrice,
      priceChange,
      percentChange,
      timestamp: Date.now(),
    });
  }
}
