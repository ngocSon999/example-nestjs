import { CategoryCreateInput, CategoryCreateOutput } from '@/core/category/use-cases/category-create';
import { CategoryDeleteInput, CategoryDeleteOutput } from '@/core/category/use-cases/category-delete';
import { CategoryGetByIdInput, CategoryGetByIdOutput } from '@/core/category/use-cases/category-get-by-id';
import { CategoryListInput, CategoryListOutput } from '@/core/category/use-cases/category-list';
import { CategoryUpdateInput, CategoryUpdateOutput } from '@/core/category/use-cases/category-update';
import { ApiTrancingInput } from '@/utils/request';
import { IUsecase } from '@/utils/usecase';

export abstract class ICategoryCreateAdapter implements IUsecase {
  abstract execute(input: CategoryCreateInput, trace: ApiTrancingInput): Promise<CategoryCreateOutput>;
}

export abstract class ICategoryUpdateAdapter implements IUsecase {
  abstract execute(input: CategoryUpdateInput, trace: ApiTrancingInput): Promise<CategoryUpdateOutput>;
}

export abstract class ICategoryGetByIdAdapter implements IUsecase {
  abstract execute(input: CategoryGetByIdInput): Promise<CategoryGetByIdOutput>;
}

export abstract class ICategoryListAdapter implements IUsecase {
  abstract execute(input: CategoryListInput): Promise<CategoryListOutput>;
}

export abstract class ICategoryDeleteAdapter implements IUsecase {
  abstract execute(input: CategoryDeleteInput, trace: ApiTrancingInput): Promise<CategoryDeleteOutput>;
}
