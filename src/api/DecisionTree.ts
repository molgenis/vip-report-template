export interface BoolMultiNode extends Node {
  nodeType: NodeType;
  id: string;
  decisionType: DecisionType;
  fields: string[];
  outcomes: BoolMultiQuery[];
  outcomeMissing: NodeOutcome;
  outcomeDefault: NodeOutcome;
}

export interface BoolMultiQuery {
  id: string;
  queries: BoolQuery[];
  outcomeTrue: NodeOutcome;
  operator: ClauseOperator;
}

export interface BoolNode extends Node {
  query: BoolQuery;
  outcomeTrue: NodeOutcome;
  outcomeFalse: NodeOutcome;
  outcomeMissing: NodeOutcome;
}

export interface BoolQuery {
  field: string;
  operator: Operator;
  value: unknown;
}

export interface CategoricalNode extends Node {
  field: string;
  outcomeMap: { [index: string]: NodeOutcome };
  outcomeMissing: NodeOutcome;
  outcomeDefault: NodeOutcome;
}

export interface DecisionTree {
  rootNode: string;
  nodes: { [index: string]: Node };
  labels: { [index: string]: Label };
  files: { [index: string]: Path };
}

export interface ExistsNode extends Node {
  field: string;
  outcomeTrue: NodeOutcome;
  outcomeFalse: NodeOutcome;
}

export interface Label {
  id: string;
  description: string;
}

export interface LeafNode extends Node {
  class: string;
}

export interface Node {
  type: Type;
  description: string;
}

export interface NodeOutcome {
  nextNode: string;
  label: string;
}

export interface Path {
  [key: string]: string;
}

export type ClauseOperator = "AND" | "OR";

export type Operator =
  | "=="
  | "!="
  | "<"
  | "<="
  | ">"
  | ">="
  | "in"
  | "!in"
  | "contains"
  | "!contains"
  | "contains_any"
  | "contains_all"
  | "contains_none";

export type Type = "BOOL" | "BOOL_MULTI" | "CATEGORICAL" | "EXISTS" | "LEAF";

export type NodeType = "DECISION" | "LEAF";

export type DecisionType = "BOOL" | "BOOL_MULTI" | "CATEGORICAL" | "EXISTS";
