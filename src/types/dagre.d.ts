import { Graph } from 'graphlib';

export type TreeGraph = Graph | Graph<Record<string, never>>;
