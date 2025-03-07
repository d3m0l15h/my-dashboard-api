import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis.Redis;
  constructor() { }

  onModuleInit() {
    this.client = new Redis.Redis({
      host: process.env.REDIS_HOST, // Replace with your Redis server host
      port: 6379,        // Replace with your Redis server port
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * Get the time to live for a key in seconds
   * @param key 
   * @returns 
   */
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  /**
   * Set a key with a value and time to live
   * @param key 
   * @param value 
   * @param ttl 
   */
  async set(key: string, value: string | number): Promise<void> {
      await this.client.set(key, value);
  }

  /**
   * Increment the integer value of a key by one
   * @param key 
   * @returns 
   */
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  /**
   * Set a key's time to live in seconds
   * @param key 
   * @param ttl 
   */
  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  /**
   * Get all the fields and values in a hash
   * @param key 
   * @param values 
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.client.hgetall(key);
  }

  /**
   * Set the string value of a hash field
   * @param key 
   * @param values 
   */
  async hset(key: string, values: Record<string, string>): Promise<void> {
    await this.client.hset(key, values);
  }
}
