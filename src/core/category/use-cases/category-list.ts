import { z } from 'zod';

import { CategoryEntity } from '@/core/category/entity/category';
import { ValidateSchema } from '@/utils/decorators';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination';
import { SearchSchema } from '@/utils/search';
import { SortSchema } from '@/utils/sort';
import { IUsecase } from '@/utils/usecase';

import { ICategoryRepository } from '../repository/category';

export const CategoryListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type CategoryListInput = PaginationInput<CategoryEntity>;
export type CategoryListOutput = PaginationOutput<CategoryEntity>;

export class CategoryListUsecase implements IUsecase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  @ValidateSchema(CategoryListSchema)
  async execute(input: CategoryListInput): Promise<CategoryListOutput> {
    return await this.categoryRepository.paginate(input);
  }
}
