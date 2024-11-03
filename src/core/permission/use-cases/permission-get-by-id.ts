import { z } from 'zod';

import { PermissionEntitySchema } from '@/core/permission/entity/permission';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { PermissionEntity } from '../entity/permission';
import { IPermissionRepository } from '../repository/permission';

export const PermissionGetByIdSchema = PermissionEntitySchema.pick({
  id: true
});

export type PermissionGetByIdInput = z.infer<typeof PermissionGetByIdSchema>;
export type PermissionGetByIdOutput = PermissionEntity;

export class PermissionGetByIdUsecase implements IUsecase {
  constructor(private readonly permissionRepository: IPermissionRepository) {}

  @ValidateSchema(PermissionGetByIdSchema)
  async execute({ id }: PermissionGetByIdInput): Promise<PermissionGetByIdOutput> {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new ApiNotFoundException('permissionNotFound');
    }

    return new PermissionEntity(permission);
  }
}
