import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TickerService } from './ticker.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('ticker')
export class TickerController {
  constructor(
    private readonly tickerService: TickerService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Get('pairs')
  async getTradingPairs() {
    // Fetch the top 100 trading pairs from Binance
    return await this.tickerService.getTopTradingPairs();
  }

  @Post('subscribe')
  async subscribeToPair(
    @Body('userId') userId: string,
    @Body('pair') pair: string,
  ) {
    // Subscribe the user to the trading pair
    await this.tickerService.subscribeUser(userId, pair);
    return { message: `User ${userId} subscribed to ${pair}` };
  }

  @Post('unsubscribe')
  async unsubscribeFromPair(
    @Body('userId') userId: string,
    @Body('pair') pair: string,
  ) {
    // Unsubscribe the user from the trading pair
    await this.tickerService.unsubscribeUser(userId, pair);
    return { message: `User ${userId} unsubscribed from ${pair}` };
  }

  @Get(':pair/details')
  async getPairDetails(@Param('pair') pair: string) {
    // Fetch 24-hour stats for the trading pair
    return await this.tickerService.getPairDetails(pair);
  }
}
