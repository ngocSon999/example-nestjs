import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { RoleEntity, RoleEnum } from '@/core/role/entity/role';
import { IUserDeleteAdapter } from '@/modules/user/adapter';
import { ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { UserEntity } from '../../entity/user';
import { IUserRepository } from '../../repository/user';
import { UserDeleteUsecase } from '../user-delete';

describe(UserDeleteUsecase.name, () => {
  let usecase: IUserDeleteAdapter;
  let repository: IUserRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IUserRepository,
          useValue: {}
        },
        {
          provide: IUserDeleteAdapter,
          useFactory: (userRepository: IUserRepository) => {
            return new UserDeleteUsecase(userRepository);
          },
          inject: [IUserRepository]
        }
      ]
    }).compile();

    usecase = app.get(IUserDeleteAdapter);
    repository = app.get(IUserRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({ id: 'uuid' }, TestUtils.getMockTracing()),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Invalid uuid', path: UserEntity.nameOf('id') }]);
      }
    );
  });

  test('when user not found, should expect an error', async () => {
    repository.findOneWithRelation = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute({ id: TestUtils.getMockUUID() }, TestUtils.getMockTracing())).rejects.toThrow(
      ApiNotFoundException
    );
  });

  const user = new UserEntity({
    id: TestUtils.getMockUUID(),
    email: 'admin@admin.com',
    name: '*Admin',
    roles: [new RoleEntity({ id: TestUtils.getMockUUID(), name: RoleEnum.USER })],
    password: { id: TestUtils.getMockUUID(), password: '****' }
  });

  test('when user deleted successfully, should expect an user that has been deleted.', async () => {
    repository.findOneWithRelation = jest.fn().mockResolvedValue(user);
    repository.softRemove = jest.fn();

    await expect(usecase.execute({ id: TestUtils.getMockUUID() }, TestUtils.getMockTracing())).resolves.toEqual(
      expect.any(UserEntity)
    );
    expect(repository.softRemove).toHaveBeenCalled();
  });
});
