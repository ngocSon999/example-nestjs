import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { RoleEntity, RoleEnum } from '@/core/role/entity/role';
import { ITokenAdapter, TokenLibModule } from '@/libs/token';
import { ILoginAdapter } from '@/modules/login/adapter';
import { ApiBadRequestException, ApiNotFoundException } from '@/utils/exception';
import { TestUtils } from '@/utils/tests';

import { UserEntity } from '../../entity/user';
import { IUserRepository } from '../../repository/user';
import { LoginInput, LoginOutput, LoginUsecase } from '../user-login';

describe(LoginUsecase.name, () => {
  let usecase: ILoginAdapter;
  let repository: IUserRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [TokenLibModule],
      providers: [
        {
          provide: IUserRepository,
          useValue: {}
        },
        {
          provide: ILoginAdapter,
          useFactory: (userRepository: IUserRepository, token: ITokenAdapter) => {
            return new LoginUsecase(userRepository, token);
          },
          inject: [IUserRepository, ITokenAdapter]
        }
      ]
    }).compile();

    usecase = app.get(ILoginAdapter);
    repository = app.get(IUserRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as LoginInput, TestUtils.getMockTracing()),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: UserEntity.nameOf('email') },
          { message: 'Required', path: 'password' }
        ]);
      }
    );
  });

  const input: LoginInput = { email: 'admin@admin.com', password: '****' };
  test('when user not found, should expect an error', async () => {
    repository.findOneWithRelation = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(input, TestUtils.getMockTracing())).rejects.toThrow(ApiNotFoundException);
  });

  const user = new UserEntity({
    id: TestUtils.getMockUUID(),
    email: 'admin@admin.com',
    name: 'Admin',
    roles: [new RoleEntity({ id: TestUtils.getMockUUID(), name: RoleEnum.USER })],
    password: { id: TestUtils.getMockUUID(), password: '***' }
  });

  test('when user role not found, should expect an error', async () => {
    repository.findOneWithRelation = jest.fn().mockResolvedValue({ ...user, roles: [] });

    await expect(usecase.execute(input, TestUtils.getMockTracing())).rejects.toThrow(ApiNotFoundException);
  });

  test('when password is incorrect, should expect an error', async () => {
    repository.findOneWithRelation = jest.fn().mockResolvedValue(user);

    await expect(usecase.execute(input, TestUtils.getMockTracing())).rejects.toThrow(ApiBadRequestException);
  });

  test('when user login successfully, should expect a token', async () => {
    user.password.password = '69bf0bc46f51b33377c4f3d92caf876714f6bbbe99e7544487327920873f9820';
    repository.findOneWithRelation = jest.fn().mockResolvedValue(user);

    await expect(usecase.execute(input, TestUtils.getMockTracing())).resolves.toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    } as LoginOutput);
  });
});
