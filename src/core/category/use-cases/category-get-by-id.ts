import { z } from 'zod';

import { CategoryEntitySchema } from '@/core/category/entity/category';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { CategoryEntity } from '../entity/category';
import { ICategoryRepository } from '../repository/category';

export const CategoryGetByIdSchema = CategoryEntitySchema.pick({
  id: true
});

export type CategoryGetByIdInput = z.infer<typeof CategoryGetByIdSchema>;
export type CategoryGetByIdOutput = CategoryEntity;

export class CategoryGetByIdUsecase implements IUsecase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  @ValidateSchema(CategoryGetByIdSchema)
  async execute({ id }: CategoryGetByIdInput): Promise<CategoryGetByIdOutput> {
    const categpry = await this.categoryRepository.findById(id);

    if (!categpry) {
      throw new ApiNotFoundException();
    }

    return new CategoryEntity(categpry);
  }
}
