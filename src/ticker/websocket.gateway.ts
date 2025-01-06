import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with frontend URL in production
  },
})
export class WebSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  constructor(private readonly prisma: PrismaService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);

    client.on('identify', async (userId: number) => {
      console.log(`Identifying client ${client.id} as user ${userId}`);

      const subscriptions = await this.prisma.subscription.findMany({
        where: { userId },
        select: { symbol: true },
      });

      subscriptions.forEach(({ symbol }) => {
        const roomName = `symbol-${symbol}`;
        client.join(roomName);
        console.log(`Client ${client.id} joined room ${roomName}`);
      });
    });

    client.on('joinSymbolDetails', (symbol: string) => {
      this.joinSymbolDetailsRoom(client, symbol);
    });
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  broadcastSubscribedUsers(symbol: string, price: string) {
    this.server.to(`symbol-${symbol}`).emit('userUpdate', { symbol, price });
  }

  joinSymbolDetailsRoom(client: any, symbol: string) {
    client.join(`details-${symbol}`);
    console.log(`Client ${client.id} joined room details-${symbol}`);
  }

  broadcastSymbolDetails(symbol: string, details: any) {
    this.server.to(`details-${symbol}`).emit('symbolDetailsUpdate', details);
  }
}
