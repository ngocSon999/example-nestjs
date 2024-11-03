import { Test } from '@nestjs/testing';
import { ZodIssue } from 'zod';

import { CatListInput, CatListUsecase } from '@/core/cat/use-cases/cat-list';
import { ILoggerAdapter, LoggerModule } from '@/infra/logger';
import { ICatListAdapter } from '@/modules/cat/adapter';
import { TestUtils } from '@/utils/tests';

import { CatEntity } from '../../entity/cat';
import { ICatRepository } from '../../repository/cat';

describe(CatListUsecase.name, () => {
  let usecase: ICatListAdapter;
  let repository: ICatRepository;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        {
          provide: ICatRepository,
          useValue: {}
        },
        {
          provide: ICatListAdapter,
          useFactory: (catRepository: ICatRepository) => {
            return new CatListUsecase(catRepository);
          },
          inject: [ICatRepository, ILoggerAdapter]
        }
      ]
    }).compile();

    usecase = app.get(ICatListAdapter);
    repository = app.get(ICatRepository);
  });

  test('when no input is specified, should expect an error', async () => {
    await TestUtils.expectZodError(
      () => usecase.execute({} as CatListInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: 'sort' },
          { message: 'Required', path: 'search' }
        ]);
      }
    );
  });

  const cat = new CatEntity({
    id: TestUtils.getMockUUID(),
    age: 10,
    breed: 'dummy',
    name: 'dummy',
    createdAt: TestUtils.getMockDate(),
    updatedAt: TestUtils.getMockDate(),
    deletedAt: null
  });

  const cats = [cat];

  test('when cats are found, should expect an user list', async () => {
    const output = { docs: cats, page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual({
      docs: cats,
      page: 1,
      limit: 1,
      total: 1
    });
  });

  test('when cats not found, should expect an empty list', async () => {
    const output = { docs: [{}], page: 1, limit: 1, total: 1 };
    repository.paginate = jest.fn().mockResolvedValue(output);

    await expect(usecase.execute({ limit: 1, page: 1, search: {}, sort: { createdAt: -1 } })).resolves.toEqual(output);
  });
});
