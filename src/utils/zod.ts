import { z } from 'zod';

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type NonUndefined<T> = Exclude<T, undefined>;

export type ZodInferSchema<T extends object> = {
  [Key in keyof T]-?: Equals<T[Key], NonUndefined<T[Key]>> extends false
    ?
        | z.ZodOptional<z.ZodType<NonNullable<T[Key]>>>
        | z.ZodPipeline<z.ZodOptional<z.ZodType<unknown>>, z.ZodType<T[Key]>>
    : z.ZodType<T[Key]> | z.ZodPipeline<z.ZodType<unknown>, z.ZodType<T[Key]>>;
};
