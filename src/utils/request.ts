import { AttributeValue, Context, Span, SpanStatus, TimeInput, Tracer } from '@opentelemetry/api';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { UserEntity } from '@/core/user/entity/user';

export type TracingType = {
  span: Span;
  tracer: Tracer;
  tracerId: string;
  axios: (config?: AxiosRequestConfig) => AxiosInstance;
  setStatus: (status: SpanStatus) => void;
  logEvent: (name: string, attributesOrStartTime?: AttributeValue | TimeInput) => void;
  addAttribute: (key: string, value: AttributeValue) => void;
  createSpan: (name: string, parent?: Context) => Span;
  finish: () => void;
};

export type UserRequest = Pick<UserEntity, 'email' | 'name' | 'id'>;

export interface ApiRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly body: any;
  readonly tracing: TracingType;
  readonly user: UserRequest;
  readonly params: { [key: string]: string | number };
  readonly query: { [key: string]: string | number };
  readonly headers: Headers & { authorization: string };
  readonly url: string;
  readonly files: {
    buffer: Buffer;
    encoding: string;
    fieldname: string;
    mimetype: string;
    originalname: string;
    size: number;
  }[];
}

export type ApiTrancingInput = Pick<ApiRequest, 'user' | 'tracing'>;

export const getPathWithoutUUID = (path: string) =>
  path.replace(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, 'uuid');
