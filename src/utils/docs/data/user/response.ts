import { PermissionEntity } from '@/core/permission/entity/permission';
import { RoleEntity, RoleEnum } from '@/core/role/entity/role';
import { UserEntity } from '@/core/user/entity/user';
import { UserCreateOutput } from '@/core/user/use-cases/user-create';
import { UserDeleteOutput } from '@/core/user/use-cases/user-delete';
import { UserGetByIdOutput } from '@/core/user/use-cases/user-get-by-id';
import { UserListOutput } from '@/core/user/use-cases/user-list';
import { UserUpdateOutput } from '@/core/user/use-cases/user-update';
import { UserRequest } from '@/utils/request';
import { TestUtils } from '@/utils/tests';

const entity = {
  id: TestUtils.getMockUUID(),
  email: 'admin@admin.com',
  name: 'Admin',
  roles: [
    new RoleEntity({
      id: TestUtils.getMockUUID(),
      name: RoleEnum.USER,
      permissions: [
        new PermissionEntity({
          id: TestUtils.getMockUUID(),
          name: 'permission:create'
        })
      ]
    })
  ]
} as UserEntity;

const fullEntity = {
  ...entity,
  createdAt: TestUtils.getMockDate(),
  updatedAt: TestUtils.getMockDate(),
  deletedAt: null
} as UserEntity;

export const UsersResponse = {
  create: { created: true, id: TestUtils.getMockUUID() } as UserCreateOutput,
  delete: { ...fullEntity, deletedAt: TestUtils.getMockDate() } as UserDeleteOutput,
  update: { ...fullEntity } as UserUpdateOutput,
  getById: fullEntity as UserGetByIdOutput,
  list: { docs: [fullEntity], limit: 10, page: 1, total: 1 } as UserListOutput,
  me: { email: 'admin@admin.com', name: 'ADMIN', id: TestUtils.getMockUUID() } as UserRequest
};
