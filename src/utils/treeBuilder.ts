import {
  DecisionTree,
  Node,
  NodeWithOutcome,
  OutcomeEnum,
  OutcomeTypeEnum,
  Query,
  TreeEdgesArray,
  TreeEdgesObj,
  TreeNodes
} from '@/types/DecisionTree';

export const retrieveNodes = (inputTree: DecisionTree): TreeNodes => {
  return Object.keys(inputTree.nodes).map((key) => {
    const node = inputTree.nodes[key];
    return {
      id: key,
      label: getNodeLabel(key, node.type, 'query' in node ? node.query : undefined),
      type: node.type
    };
  });
};

export const getNodeLabel = (label: string, type: string, query: Query | undefined): string => {
  if (query) {
    return `${label}\n(${query.operator} ${query.value})`;
  } else if (type === 'EXISTS') {
    return `${label}\n(exists)`;
  } else {
    return label;
  }
};

export const createSimpleEdge = (
  outcomeType: OutcomeTypeEnum,
  node: NodeWithOutcome,
  key: string,
  edges: TreeEdgesObj
): TreeEdgesObj => {
  const outcome: OutcomeEnum = <OutcomeEnum>`outcome${outcomeType}`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const nextNode: string = node[outcome].nextNode;
  edges = createEdge(nextNode, outcomeType, key, edges);
  return edges;
};

export const createEdge = (nextNode: string, label: string, key: string, edges: TreeEdgesObj): TreeEdgesObj => {
  const edgeKey = `${key}_${nextNode}`;
  if (edges[edgeKey] === undefined) {
    edges[edgeKey] = {
      from: key,
      to: nextNode,
      label: label
    };
  } else {
    edges[edgeKey].label = `${edges[edgeKey].label}\n${label}`;
  }
  return edges;
};

export const retrieveEdges = (inputTree: DecisionTree): TreeEdgesArray => {
  let edges: TreeEdgesObj = {};
  Object.keys(inputTree.nodes).forEach((key) => {
    const node: Node = inputTree.nodes[key];
    switch (node.type) {
      case 'BOOL':
        edges = createSimpleEdge('True', node, key, edges);
        edges = createSimpleEdge('False', node, key, edges);
        if ('outcomeMissing' in node) {
          edges = createSimpleEdge('Missing', node, key, edges);
        }
        break;
      case 'CATEGORICAL':
        Object.keys(node.outcomeMap).forEach((category) => {
          const nextNode = node.outcomeMap[category].nextNode;
          edges = createEdge(nextNode, category, key, edges);
        });
        if ('outcomeMissing' in node) {
          edges = createSimpleEdge('Missing', node, key, edges);
        }
        if ('outcomeDefault' in node) {
          edges = createSimpleEdge('Default', node, key, edges);
        }
        break;
      case 'EXISTS':
        edges = createSimpleEdge('True', node, key, edges);
        edges = createSimpleEdge('False', node, key, edges);
        break;
      case 'LEAF':
        break;
      default:
        throw new Error('unknown node type');
    }
  });
  return Object.keys(edges).map((k) => edges[k]);
};
