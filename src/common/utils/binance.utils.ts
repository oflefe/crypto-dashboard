import { WebSocket } from "ws";


export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private pairs: Set<string> = new Set();

  connect(onMessage: (data: any) => void) {
    this.initializeWebSocket(onMessage);
  }

  private initializeWebSocket(onMessage: (data: any) => void) {
    const url = `wss://stream.binance.com:9443/ws`;
    this.ws = new WebSocket(url);

    this.ws.on('open', () => {
      console.log('Connected to Binance WebSocket');
      this.updateSubscription();
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
      setTimeout(() => this.initializeWebSocket(onMessage), 5000);
    });
  }

  updateSubscription() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const streams = Array.from(this.pairs).map((pair) => `${pair.toLowerCase()}@ticker`);
      this.ws.send(
        JSON.stringify({
          method: 'SUBSCRIBE',
          params: streams,
          id: 1,
        }),
      );
    }
  }

  addPair(pair: string) {
    this.pairs.add(pair);
    this.updateSubscription();
  }

  removePair(pair: string) {
    this.pairs.delete(pair);
    this.updateSubscription();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
