import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SubscriptionService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async addUserSubscription(userId: string, pair: string): Promise<void> {
    await this.redis.sadd(userId, pair); // Add pair to user's subscription set
  }

  async removeUserSubscription(userId: string, pair: string): Promise<void> {
    await this.redis.srem(userId, pair); // Remove pair from user's subscription set
  }

  async getUserSubscriptions(userId: string): Promise<string[]> {
    return await this.redis.smembers(userId); // Get all pairs user is subscribed to
  }

  async getUsersSubscribedToPair(pair: string): Promise<string[]> {
    const keys = await this.redis.keys('*'); // Get all user IDs
    const users = [];
    for (const userId of keys) {
      const subscriptions = await this.redis.smembers(userId);
      if (subscriptions.includes(pair)) {
        users.push(userId);
      }
    }
    return users;
  }
}
