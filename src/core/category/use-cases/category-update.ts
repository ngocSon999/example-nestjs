import { z } from 'zod';

import { ICategoryRepository } from '@/core/category/repository/category';
import { ILoggerAdapter } from '@/infra/logger';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { ApiTrancingInput } from '@/utils/request';
import { IUsecase } from '@/utils/usecase';

import { CategoryEntity, CategoryEntitySchema } from '../entity/category';

export const CategoryUpdateSchema = CategoryEntitySchema.pick({
  id: true
}).merge(CategoryEntitySchema.omit({ id: true }).partial());

export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
export type CategoryUpdateOutput = CategoryEntity;

export class CategoryUpdateUsecase implements IUsecase {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly loggerService: ILoggerAdapter
  ) {}

  @ValidateSchema(CategoryUpdateSchema)
  async execute(input: CategoryUpdateInput, { tracing, user }: ApiTrancingInput): Promise<CategoryUpdateOutput> {
    const category = await this.categoryRepository.findById(input.id);

    if (!category) {
      throw new ApiNotFoundException();
    }

    const entity = new CategoryEntity({ ...category, ...input });

    await this.categoryRepository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: 'category updated.', obj: { category: input } });

    const updated = await this.categoryRepository.findById(entity.id);

    tracing.logEvent('category-updated', `category updated by: ${user.email}`);

    return new CategoryEntity(updated as CategoryEntity);
  }
}
