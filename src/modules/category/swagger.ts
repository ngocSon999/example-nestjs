import { CategoryRequest } from '@/utils/docs/data/category/request';
import { CategoryResponse } from '@/utils/docs/data/category/response';
import { Swagger } from '@/utils/docs/swagger';
import { ApiNotFoundException } from '@/utils/exception';

const BASE_URL = `api/v1/category`;

export const SwaggerResponse = {
  create: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: CategoryResponse.create,
      description: 'create user.'
    })
  },
  update: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: CategoryResponse.update,
      description: 'update user.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: BASE_URL,
      message: ApiNotFoundException.name,
      description: 'category not found.'
    })
  },
  getById: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: CategoryResponse.getById,
      description: 'category founded.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: `${BASE_URL}/:id`,
      message: ApiNotFoundException.name,
      description: 'category not found.'
    })
  },
  delete: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: CategoryResponse.delete,
      description: 'category deleted.'
    }),
    404: Swagger.defaultResponseError({
      status: 404,
      route: `${BASE_URL}/:id`,
      message: ApiNotFoundException.name,
      description: 'category not found.'
    })
  },
  list: {
    200: Swagger.defaultResponseJSON({
      status: 200,
      json: CategoryResponse.list,
      description: 'category created.'
    }),
    400: Swagger.defaultResponseWithMultiplesError({
      messages: Swagger.defaultPaginateMessageExceptions(),
      route: BASE_URL,
      status: 400,
      description: 'paginate filter and sort exceptions.'
    })
  }
};

export const SwaggerRequest = {
  create: Swagger.defaultRequestJSON(CategoryRequest.create),
  update: Swagger.defaultRequestJSON(CategoryRequest.update),
  list: Swagger.defaultRequestListJSON()
};
