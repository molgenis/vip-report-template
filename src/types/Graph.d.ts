import { Graph, GraphLabel } from '@dagrejs/graphlib';

// fixes issue in Definitely typed: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47439
export type DagreGraph<UserLabel = Record<string, unknown>> = Graph<UserLabel & GraphLabel>;
