import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel } from 'mongoose';

import { CategoryEntity } from '@/core/category/entity/category';
import { ICategoryRepository } from '@/core/category/repository/category';
import { CategoryListInput, CategoryListOutput } from '@/core/category/use-cases/category-list';
import { Category, CategoryDocument } from '@/infra/database/mongo/schemas/category';
import { MongoRepository } from '@/infra/repository';
import { ConvertMongooseFilter, SearchTypeEnum, ValidateDatabaseSortAllowed } from '@/utils/decorators';
import { IEntity } from '@/utils/entity';
import { MongoRepositoryModelSessionType } from '@/utils/mongoose';

@Injectable()
export class CategoryRepository extends MongoRepository<CategoryDocument> implements ICategoryRepository {
  constructor(
    @InjectModel(Category.name) readonly entity: MongoRepositoryModelSessionType<PaginateModel<CategoryDocument>>
  ) {
    super(entity);
  }

  @ValidateDatabaseSortAllowed<CategoryEntity>({ name: 'createdAt' }, { name: 'slug' })
  @ConvertMongooseFilter<CategoryEntity>([
    { name: 'name', type: SearchTypeEnum.like },
    { name: 'slug', type: SearchTypeEnum.like }
  ])
  async paginate({ limit, page, search, sort }: CategoryListInput): Promise<CategoryListOutput> {
    const categories = await this.entity.paginate(search as FilterQuery<IEntity>, {
      page,
      limit,
      sort: sort as object
    });

    return {
      docs: categories.docs.map((u) => new CategoryEntity(u.toObject({ virtuals: true }))),
      limit,
      page,
      total: categories.totalDocs
    };
  }
}
