import axios from 'axios';
import { WebSocket } from 'ws';

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private pairs: Set<string> = new Set();
  private reconnectAttempts = 0;
  private readonly binanceApiUrl: string = process.env.BINANCE_API_BASE_URL;
  private readonly maxReconnectAttempts = 5;

  async connect(onMessage: (data: any) => void) {
    const pairArray = await this.fetchPairs();
    pairArray.forEach((pair) => {
      this.addPair(pair.symbol);
    });
    this.initializeWebSocket(onMessage);
  }

  private initializeWebSocket(onMessage: (data: any) => any) {
    const streams = Array.from(this.pairs).map(
      (pair) => `${pair.toLowerCase()}@ticker`,
    );
    const url = streams.length
      ? `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`
      : `wss://stream.binance.com:9443/ws`;

    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('Connected to Binance WebSocket', this.ws.url);
      this.reconnectAttempts = 0; // Reset on successful connection
    });

    this.ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message.toString());
      onMessage(parsedMessage);
    });

    this.ws.on('error', (error) => {
      console.error('Binance WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('Binance WebSocket closed. Reconnecting...');
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        setTimeout(() => this.initializeWebSocket(onMessage), 5000); // 5-second delay
      } else {
        console.error(
          'Max reconnect attempts reached. WebSocket closed permanently.',
        );
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addPair(pair: string) {
    this.pairs.add(pair);
    this.updateSubscription();
  }

  private formatTickerData(data: any) {
    return {
      symbol: data.s, // Symbol
      price: data.c, // Last price
      change: data.p, // Price change
      percentChange: data.P, // Price change percent
      high: data.h, // High price
      low: data.l, // Low price
      volume: data.v, // Total traded base asset volume
      timestamp: data.E, // Event time
    };
  }

  async fetchPairs() {
    const response = await axios.get(`${this.binanceApiUrl}/ticker/24hr`);
    return response.data.slice(0, 10).map((ticker: any) => ({
      symbol: ticker.symbol,
      priceChange: ticker.priceChange,
      priceChangePercent: ticker.priceChangePercent,
    }));
  }

  removePair(pair: string) {
    this.pairs.delete(pair);
    this.updateSubscription();
  }

  private updateSubscription() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const streams = Array.from(this.pairs).map(
        (pair) => `${pair.toLowerCase()}@ticker`,
      );
      this.ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: streams,
          id: 1,
        }),
      );
    }
  }
}
