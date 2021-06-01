import { Node } from './Node'

export type DecisionTree = {
  [key: string]: unknown,
  nodes: {
    [key: string]: Node,
  }
}
