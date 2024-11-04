import { Controller, Delete, Get, Post, Put, Req, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CategoryCreateInput, CategoryCreateOutput } from '@/core/category/use-cases/category-create';
import { CategoryDeleteInput, CategoryDeleteOutput } from '@/core/category/use-cases/category-delete';
import { CategoryGetByIdInput, CategoryGetByIdOutput } from '@/core/category/use-cases/category-get-by-id';
import { CategoryListInput, CategoryListOutput } from '@/core/category/use-cases/category-list';
import { CategoryUpdateInput, CategoryUpdateOutput } from '@/core/category/use-cases/category-update';
import { Permission } from '@/utils/decorators';
import { ApiRequest } from '@/utils/request';
import { SearchHttpSchema } from '@/utils/search';
import { SortHttpSchema } from '@/utils/sort';

import {
  ICategoryCreateAdapter,
  ICategoryDeleteAdapter,
  ICategoryGetByIdAdapter,
  ICategoryListAdapter,
  ICategoryUpdateAdapter
} from './adapter';
import { SwaggerRequest, SwaggerResponse } from './swagger';

@Controller('category')
@ApiTags('category')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    private readonly createUsecase: ICategoryCreateAdapter,
    private readonly updateUsecase: ICategoryUpdateAdapter,
    private readonly getByIdUsecase: ICategoryGetByIdAdapter,
    private readonly listUsecase: ICategoryListAdapter,
    private readonly deleteUsecase: ICategoryDeleteAdapter
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[200])
  @ApiBody(SwaggerRequest.create)
  @Version('1')
  @Permission('category:create')
  async create(@Req() { body, user, tracing }: ApiRequest): Promise<CategoryCreateOutput> {
    return await this.createUsecase.execute(body as CategoryCreateInput, { user, tracing });
  }

  @Put(':id')
  @ApiResponse(SwaggerResponse.update[200])
  @ApiResponse(SwaggerResponse.update[404])
  @ApiBody(SwaggerRequest.update)
  @ApiParam({ name: 'id', required: true, allowEmptyValue: false })
  @Version('1')
  @Permission('category:update')
  async update(@Req() { body, user, tracing, params }: ApiRequest): Promise<CategoryUpdateOutput> {
    return await this.updateUsecase.execute({ ...body, id: params.id } as CategoryUpdateInput, { user, tracing });
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, allowEmptyValue: false })
  @ApiResponse(SwaggerResponse.getById[200])
  @ApiResponse(SwaggerResponse.getById[404])
  @Version('1')
  @Permission('category:getbyid')
  async getById(@Req() { params }: ApiRequest): Promise<CategoryGetByIdOutput> {
    return await this.getByIdUsecase.execute(params as CategoryGetByIdInput);
  }

  @Get()
  @ApiQuery(SwaggerRequest.list.pagination.limit)
  @ApiQuery(SwaggerRequest.list.pagination.page)
  @ApiQuery(SwaggerRequest.list.sort)
  @ApiQuery(SwaggerRequest.list.search)
  @ApiResponse(SwaggerResponse.list[200])
  @ApiResponse(SwaggerResponse.list[400])
  @Version('1')
  @Permission('category:list')
  async list(@Req() { query }: ApiRequest): Promise<CategoryListOutput> {
    const input: CategoryListInput = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: Number(query.limit),
      page: Number(query.page)
    };

    return await this.listUsecase.execute(input);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true, allowEmptyValue: false })
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[404])
  @Version('1')
  @Permission('category:delete')
  async delete(@Req() { params, user, tracing }: ApiRequest): Promise<CategoryDeleteOutput> {
    return await this.deleteUsecase.execute(params as CategoryDeleteInput, { user, tracing });
  }
}
