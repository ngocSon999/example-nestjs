import { IRepository } from '@/infra/repository';

import { CategoryEntity } from '../entity/category';
import { CategoryListInput, CategoryListOutput } from '../use-cases/category-list';

export abstract class ICategoryRepository extends IRepository<CategoryEntity> {
  abstract paginate(input: CategoryListInput): Promise<CategoryListOutput>;
}
