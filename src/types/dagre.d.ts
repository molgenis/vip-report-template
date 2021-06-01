import { Node } from 'dagre-d3'
import { Graph } from 'graphlib'

export interface StyledNode extends Node {
  style?: string
}

export type TreeGraph = Graph | Graph<Record<string, never>>
