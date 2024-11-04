import { z } from 'zod';

import { BaseEntity } from '@/utils/entity';

const ID = z.string().uuid();
const Name = z.string().trim().min(1).max(200);
const Slug = z.string().trim().min(1).max(200);
const CreatedAt = z.date().nullish();
const UpdatedAt = z.date().nullish();
const DeletedAt = z.date().nullish();

export const CategoryEntitySchema = z.object({
  id: ID,
  name: Name,
  slug: Slug,
  createdAt: CreatedAt,
  updatedAt: UpdatedAt,
  deletedAt: DeletedAt
});

type Category = z.infer<typeof CategoryEntitySchema>;

export class CategoryEntity extends BaseEntity<CategoryEntity>(CategoryEntitySchema) {
  name!: string;

  slug!: string;

  constructor(entity: Category) {
    super();
    Object.assign(this, this.validate(entity));
  }
}
