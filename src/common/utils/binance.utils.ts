import { WebSocket } from 'ws';

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private readonly BINANCE_URL = 'wss://stream.binance.com:9443/stream';
  private trackedSymbols: Set<string> = new Set();

  connect(onMessage: (data: any) => void) {
    const streams = Array.from(this.trackedSymbols).map(
      (symbol) => `${symbol.toLowerCase()}@ticker`,
    );
    const url = `${this.BINANCE_URL}?streams=${streams.join('/')}`;
    this.ws = new WebSocket(url);

    this.ws.on('open', () => console.log('Connected to Binance WebSocket'));

    this.ws.on('message', (message) => {
      const parsed = JSON.parse(message.toString());
      if (parsed.data) onMessage(parsed.data);
    });

    this.ws.on('close', () => {
      console.log('Binance WebSocket closed. Reconnecting...');
      setTimeout(() => this.connect(onMessage), 5000);
    });
  }

  updateTrackedSymbols(symbols: string[]) {
    this.trackedSymbols = new Set(symbols);
    this.connect(() => {});
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}
