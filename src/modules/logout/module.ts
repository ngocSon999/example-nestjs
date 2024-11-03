import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LogoutUsecase } from '@/core/user/use-cases/user-logout';
import { ICacheAdapter } from '@/infra/cache';
import { RedisCacheModule } from '@/infra/cache/redis';
import { LoggerModule } from '@/infra/logger';
import { ISecretsAdapter, SecretsModule } from '@/infra/secrets';
import { IsLoggedMiddleware } from '@/observables/middlewares';

import { TokenLibModule } from '../../libs/token/module';
import { ILogoutAdapter } from './adapter';
import { LogoutController } from './controller';

@Module({
  imports: [RedisCacheModule, SecretsModule, RedisCacheModule, TokenLibModule, LoggerModule],
  controllers: [LogoutController],
  providers: [
    {
      provide: ILogoutAdapter,
      useFactory: (cache: ICacheAdapter, secrets: ISecretsAdapter) => {
        return new LogoutUsecase(cache, secrets);
      },
      inject: [ICacheAdapter, ISecretsAdapter]
    }
  ],
  exports: [ILogoutAdapter]
})
export class LogoutModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(LogoutController);
  }
}
