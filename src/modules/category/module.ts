import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import { ICategoryRepository } from '@/core/category/repository/category';
import { CategoryCreateUsecase } from '@/core/category/use-cases/category-create';
import { CategoryDeleteUsecase } from '@/core/category/use-cases/category-delete';
import { CategoryGetByIdUsecase } from '@/core/category/use-cases/category-get-by-id';
import { CategoryListUsecase } from '@/core/category/use-cases/category-list';
import { CategoryUpdateUsecase } from '@/core/category/use-cases/category-update';
import { RedisCacheModule } from '@/infra/cache/redis';
import { ConnectionName } from '@/infra/database/enum';
import { Category, CategoryDocument, CategorySchema } from '@/infra/database/mongo/schemas/category';
import { PostgresDatabaseModule } from '@/infra/database/postgres/module';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { TokenLibModule } from '@/libs/token';
import { IsLoggedMiddleware } from '@/observables/middlewares';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

import {
  ICategoryCreateAdapter,
  ICategoryDeleteAdapter,
  ICategoryGetByIdAdapter,
  ICategoryListAdapter,
  ICategoryUpdateAdapter
} from './adapter';
import { CategoryController } from './controller';
import { CategoryRepository } from './repository';

@Module({
  imports: [TokenLibModule, LoggerModule, RedisCacheModule, PostgresDatabaseModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: ICategoryRepository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<CategoryDocument>;

        //  use if you want transaction
        const repository: MongoRepositoryModelSessionType<PaginateModel<CategoryDocument>> = connection.model<
          CategoryDocument,
          Model
        >(Category.name, CategorySchema as Schema);

        repository.connection = connection;

        // use if you not want transaction
        // const repository: PaginateModel<UserDocument> = connection.model<UserDocument, Model>(
        //   User.name,
        //   UserSchema as Schema
        // );

        return new CategoryRepository(repository);
      },
      inject: [getConnectionToken(ConnectionName.CATEGORIES)]
    },
    {
      provide: ICategoryCreateAdapter,
      useFactory: (repository: ICategoryRepository) => new CategoryCreateUsecase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: ICategoryUpdateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: ICategoryRepository) =>
        new CategoryUpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, ICategoryRepository]
    },
    {
      provide: ICategoryGetByIdAdapter,
      useFactory: (repository: ICategoryRepository) => new CategoryGetByIdUsecase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: ICategoryListAdapter,
      useFactory: (repository: ICategoryRepository) => new CategoryListUsecase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: ICategoryDeleteAdapter,
      useFactory: (repository: ICategoryRepository) => new CategoryDeleteUsecase(repository),
      inject: [ICategoryRepository]
    }
  ],
  exports: []
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(CategoryController);
  }
}
