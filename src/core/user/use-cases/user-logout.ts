import { z } from 'zod';

import { ICacheAdapter } from '@/infra/cache';
import { ISecretsAdapter } from '@/infra/secrets';
import { ValidateSchema } from '@/utils/decorators';
import { ApiTrancingInput } from '@/utils/request';
import { IUsecase } from '@/utils/usecase';

export const LogoutSchema = z.object({ token: z.string().trim().min(10) });

export type LogoutInput = z.infer<typeof LogoutSchema>;
export type LogoutOutput = Promise<void>;

export class LogoutUsecase implements IUsecase {
  constructor(
    private readonly redis: ICacheAdapter,
    private readonly secretes: ISecretsAdapter
  ) {}

  @ValidateSchema(LogoutSchema)
  async execute(input: LogoutInput, { tracing, user }: ApiTrancingInput): LogoutOutput {
    await this.redis.set(input.token, input.token, { PX: this.secretes.TOKEN_EXPIRATION });

    tracing.logEvent('user-logout', `${user.email}`);
  }
}
