import { Outcome, BoolOutcome } from './Outcome'

type BoolNode = {
  type: 'BOOL',
  query: {
    field: string,
    operator: string,
    value: string
  },
  outcomeMissing?: Outcome
} & BoolOutcome

type ExistsNode = {
  type: 'EXISTS',
  field: string
} & BoolOutcome

type CategoricalNode = {
  type: 'CATEGORICAL',
  field: string,
  outcomeMap: {
    [key: string]: Outcome
  }
  outcomeMissing: Outcome
  outcomeDefault: Outcome
}

type ExitNode = {
  type: 'LEAF',
  class: 'T' | 'F'
}

type NodeDescription = { description: string }

type NodeWithSimpleOutcome = NodeDescription & (BoolNode | ExistsNode)
type NodeWithCategoricalOutcome = NodeDescription & CategoricalNode
export type NodeWithOutcome = NodeWithSimpleOutcome | NodeWithCategoricalOutcome
export type Node = NodeWithOutcome | ExitNode
