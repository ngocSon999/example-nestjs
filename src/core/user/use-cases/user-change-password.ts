import { z } from 'zod';

import { CryptoUtils } from '@/utils/crypto';
import { ValidateSchema } from '@/utils/decorators';
import { ApiBadRequestException, ApiNotFoundException } from '@/utils/exception';
import { IUsecase } from '@/utils/usecase';

import { UserEntitySchema } from '../entity/user';
import { UserPasswordEntity } from '../entity/user-password';
import { IUserRepository } from '../repository/user';

export const UserChangePasswordSchema = UserEntitySchema.pick({
  id: true
}).merge(z.object({ password: z.string(), newPassword: z.string(), confirmPassword: z.string() }));

export type UserChangePasswordInput = z.infer<typeof UserChangePasswordSchema>;
export type UserChangePasswordOutput = void;

export class UserChangePasswordUsecase implements IUsecase {
  constructor(private readonly repository: IUserRepository) {}

  @ValidateSchema(UserChangePasswordSchema)
  async execute(input: UserChangePasswordInput): Promise<UserChangePasswordOutput> {
    const user = await this.repository.findOneWithRelation({ id: input.id }, { password: true });

    if (!user) {
      throw new ApiNotFoundException('userNotFound');
    }

    const entityPassword = new UserPasswordEntity(user.password);

    const password = CryptoUtils.createHash(input.password);

    entityPassword.verifyPassword(password);

    if (input.newPassword !== input.confirmPassword) {
      throw new ApiBadRequestException('passwordIsDifferent');
    }

    entityPassword.password = input.newPassword;

    entityPassword.createPassword();

    user.password = entityPassword;

    await this.repository.create(user);
  }
}
