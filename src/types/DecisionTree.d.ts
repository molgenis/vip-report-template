type Outcome = {
  nextNode: string;
};

type BoolOutcome = {
  outcomeTrue: Outcome;
  outcomeFalse: Outcome;
};

type BoolNode = {
  type: 'BOOL';
  query: {
    field: string;
    operator: string;
    value: string;
  };
  outcomeMissing?: Outcome;
} & BoolOutcome;

type ExistsNode = {
  type: 'EXISTS';
  field: string;
} & BoolOutcome;

type CategoricalNode = {
  type: 'CATEGORICAL';
  field: string;
  outcomeMap: {
    [key: string]: Outcome;
  };
  outcomeMissing: Outcome;
  outcomeDefault: Outcome;
};

type ExitNode = {
  type: 'LEAF';
  class: 'T' | 'F';
};

type NodeDescription = { description: string };

type NodeWithSimpleOutcome = NodeDescription & (BoolNode | ExistsNode);
type NodeWithCategoricalOutcome = NodeDescription & CategoricalNode;

type Edge = { from: string; to: string; label: string };

export type NodeWithOutcome = NodeWithSimpleOutcome | NodeWithCategoricalOutcome;

export type Node = NodeWithOutcome | ExitNode;

export type DecisionTree = {
  [key: string]: unknown;
  nodes: {
    [key: string]: Node;
  };
};

export type TreeEdgesObj = {
  [key: string]: Edge;
};

export type TreeEdgesArray = Edge[];

export type TreeNodes = Array<{ id: string; label: string }>;

export type OutcomeTypeEnum = 'True' | 'False' | 'Missing' | 'Default';

export type OutcomeEnum = 'outcomeTrue' | 'outcomeFalse' | 'outcomeMissing' | 'outcomeDefault';
