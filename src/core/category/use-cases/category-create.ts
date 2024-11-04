import { z } from 'zod';

import { CreatedModel } from '@/infra/repository';
import { ValidateSchema } from '@/utils/decorators';
import { ApiTrancingInput } from '@/utils/request';
import { IUsecase } from '@/utils/usecase';
import { UUIDUtils } from '@/utils/uuid';

import { CategoryEntity, CategoryEntitySchema } from '../entity/category';
import { ICategoryRepository } from '../repository/category';

export const CategoryCreateSchema = CategoryEntitySchema.pick({
  name: true,
  slug: true
});

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryCreateOutput = CreatedModel;

export class CategoryCreateUsecase implements IUsecase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  @ValidateSchema(CategoryCreateSchema)
  async execute(input: CategoryCreateInput, { tracing, user }: ApiTrancingInput): Promise<CategoryCreateOutput> {
    const entity = new CategoryEntity({ id: UUIDUtils.create(), ...input });

    const created = await this.categoryRepository.create(entity);

    tracing.logEvent('category-created', `category created by: ${user.email}`);

    return created;
  }
}
