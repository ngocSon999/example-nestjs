import { z } from 'zod';

import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { ApiTrancingInput } from '@/utils/request';
import { IUsecase } from '@/utils/usecase';

import { CategoryEntity, CategoryEntitySchema } from '../entity/category';
import { ICategoryRepository } from '../repository/category';

export const CategoryDeleteSchema = CategoryEntitySchema.pick({
  id: true
});

export type CategoryDeleteInput = z.infer<typeof CategoryDeleteSchema>;
export type CategoryDeleteOutput = CategoryEntity;

export class CategoryDeleteUsecase implements IUsecase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  @ValidateSchema(CategoryDeleteSchema)
  async execute({ id }: CategoryDeleteInput, { tracing, user }: ApiTrancingInput): Promise<CategoryDeleteOutput> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new ApiNotFoundException();
    }

    const entity = new CategoryEntity(category);

    entity.deactivated();

    await this.categoryRepository.updateOne({ id: entity.id }, entity);
    tracing.logEvent('cat-deleted', `cat deleted by: ${user.email}`);

    return entity;
  }
}
