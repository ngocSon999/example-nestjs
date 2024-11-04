import { CategoryCreateInput } from '@/core/category/use-cases/category-create';
import { CategoryUpdateInput } from '@/core/category/use-cases/category-update';

export const CategoryRequest = {
  create: { name: 'miau', slug: 'slug' } as CategoryCreateInput,
  update: { name: 'miau', slug: 'slug' } as CategoryUpdateInput
};
