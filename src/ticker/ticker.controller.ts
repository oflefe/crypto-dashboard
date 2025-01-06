import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TickerService } from './ticker.service';

@Controller('ticker')
export class TickerController {
  constructor(
    private readonly tickerService: TickerService,
  ) {}

  @Get('pairs')
  async getTradingPairs() {
    // Fetch the top 100 trading pairs from Binance
    return await this.tickerService.fetchTopSymbols();
  }
}
