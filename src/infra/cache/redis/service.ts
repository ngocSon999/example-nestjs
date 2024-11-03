import { Injectable } from '@nestjs/common';
import { createClient, RedisClientOptions, RedisClientType, SetOptions } from 'redis';

import { ILoggerAdapter } from '@/infra/logger';
import { ApiInternalServerException } from '@/utils/exception';

import { ICacheAdapter } from '../adapter';
import { CacheKeyArgument, CacheKeyValue } from '../types';
import { RedisCacheKeyArgument, RedisCacheValueArgument } from './types';

@Injectable()
export class RedisService implements Partial<ICacheAdapter<RedisClientType>> {
  client: RedisClientType;

  constructor(
    private readonly config: RedisClientOptions,
    private readonly logger: ILoggerAdapter
  ) {
    this.client = createClient(this.config) as RedisClientType;
  }

  async isConnected(): Promise<void> {
    const ping = await this.client.ping();
    if (ping !== 'PONG') new ApiInternalServerException('redis disconnected.');
  }

  async connect(): Promise<RedisClientType> {
    try {
      await this.client.connect();
      this.logger.log('🎯 redis connected!\n');
      return this.client;
    } catch (error) {
      throw new ApiInternalServerException((error as { message: string }).message, {
        context: `${RedisService.name}/connect`
      });
    }
  }

  async set<TKey = RedisCacheKeyArgument, TValue = RedisCacheValueArgument, TConf = object>(
    key: TKey,
    value: TValue,
    config?: TConf
  ): Promise<void> {
    await this.client.set(key as RedisCacheKeyArgument, value as RedisCacheValueArgument, config as SetOptions);
  }

  async get<TKey = RedisCacheKeyArgument>(key: TKey): Promise<string | null> {
    const getResult = await this.client.get(key as RedisCacheKeyArgument);

    return getResult;
  }

  async del(key: CacheKeyArgument): Promise<void> {
    await this.client.del(key);
  }

  async setMulti(redisList: CacheKeyValue[]): Promise<void> {
    const multi = this.client.multi();

    for (const model of redisList) {
      multi.rPush(model.key, model.value);
    }

    await multi.exec();
  }

  async pExpire(key: CacheKeyArgument, milliseconds: number): Promise<void> {
    await this.client.pExpire(key, milliseconds);
  }

  async hGet<TKey = RedisCacheKeyArgument, TArs = RedisCacheKeyArgument>(
    key: TKey,
    field: TArs
  ): Promise<unknown | unknown[]> {
    return await this.client.hGet(key as RedisCacheKeyArgument, field as RedisCacheKeyArgument);
  }

  async hSet<TKey = RedisCacheKeyArgument, TField = RedisCacheKeyArgument, TValue = RedisCacheValueArgument>(
    key: TKey,
    field: TField,
    value: TValue
  ): Promise<number> {
    return await this.client.hSet(
      key as RedisCacheKeyArgument,
      field as RedisCacheKeyArgument,
      value as RedisCacheValueArgument
    );
  }

  async hGetAll(key: CacheKeyArgument): Promise<unknown | unknown[]> {
    return await this.client.hGetAll(key);
  }
}
