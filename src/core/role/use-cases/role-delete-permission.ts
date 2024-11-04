import { z } from 'zod';

import { IPermissionRepository } from '@/core/permission/repository/permission';
import { ValidateSchema } from '@/utils/decorators';
import { ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { RoleEntity, RoleEntitySchema } from '../entity/role';
import { IRoleRepository } from '../repository/role';

export const RoleDeletePermissionSchema = RoleEntitySchema.pick({
  id: true
}).merge(z.object({ permissions: z.array(z.string()) }));

export type RoleDeletePermissionInput = z.infer<typeof RoleDeletePermissionSchema>;
export type RoleDeletePermissionOutput = void;

export class RoleDeletePermissionUsecase implements IUsecase {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  @ValidateSchema(RoleDeletePermissionSchema)
  async execute(input: RoleDeletePermissionInput): Promise<RoleDeletePermissionOutput> {
    const role = await this.roleRepository.findOne({ id: input.id });

    if (!role) {
      throw new ApiNotFoundException('roleNotFound');
    }

    const entity = new RoleEntity(role);
    // const permissions = await this.permissionRepository.findIn({ name: input.permissions });
    const permissions = entity.permissions;

    for (const permission of input.permissions) {
      const permissionExists = permissions.find((p) => p.name === permission);

      if (!permissionExists) {
        continue;
      }

      const permissionAssociated = entity.permissions.find((p) => p.name === permission);

      if (permissionAssociated) {
        entity.permissions = entity.permissions.filter((p) => p.name !== permissionAssociated.name);
      }
    }

    await this.roleRepository.create(entity);
  }
}
