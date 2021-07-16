type Outcome = {
  nextNode: string;
};

export type Exists = 'EXISTS';

type BoolOutcome = {
  outcomeTrue: Outcome;
  outcomeFalse: Outcome;
};

type Query = {
  field: string;
  operator: string;
  value: string;
};

type BoolNode = {
  type: 'BOOL';
  query: Query;
  outcomeMissing?: Outcome;
} & BoolOutcome;

type ExistsNode = {
  type: Exists;
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
  class: string;
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

export type TreeNodes = Array<{ id: string; label: string; type: string }>;

export type OutcomeTypeEnum = 'True' | 'False' | 'Missing' | 'Default';

export type OutcomeEnum = 'outcomeTrue' | 'outcomeFalse' | 'outcomeMissing' | 'outcomeDefault';
