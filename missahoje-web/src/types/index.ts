import type { components, paths } from './api';

export type Schemas = components['schemas'];

type JsonBody<Operation> = Operation extends { responses: { 200: { content: { 'application/json': infer Body } } } }
  ? Body
  : never;

export type GetResponse<Path extends keyof paths> = JsonBody<paths[Path]['get']>;
