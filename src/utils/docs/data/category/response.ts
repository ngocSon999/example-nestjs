import { CategoryEntity } from '@/core/category/entity/category';
import { CategoryCreateOutput } from '@/core/category/use-cases/category-create';
import { CategoryDeleteOutput } from '@/core/category/use-cases/category-delete';
import { CategoryGetByIdOutput } from '@/core/category/use-cases/category-get-by-id';
import { CategoryListOutput } from '@/core/category/use-cases/category-list';
import { CategoryUpdateOutput } from '@/core/category/use-cases/category-update';
import { TestUtils } from '@/utils/tests';

const entity = {
  id: TestUtils.getMockUUID(),
  name: 'Miau',
  slug: 'breed'
} as CategoryEntity;

const fullEntity = {
  ...entity,
  createdAt: TestUtils.getMockDate(),
  updatedAt: TestUtils.getMockDate(),
  deletedAt: null
} as CategoryEntity;

export const CategoryResponse = {
  create: { created: true, id: TestUtils.getMockUUID() } as CategoryCreateOutput,
  delete: { ...fullEntity, deletedAt: TestUtils.getMockDate() } as CategoryDeleteOutput,
  update: fullEntity as CategoryUpdateOutput,
  getById: fullEntity as CategoryGetByIdOutput,
  list: { docs: [fullEntity], limit: 10, page: 1, total: 1 } as CategoryListOutput
};
