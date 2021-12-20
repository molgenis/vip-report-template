import { createEdge, createSimpleEdge, getNodeLabel, retrieveEdges, retrieveNodes } from '@/utils/treeBuilder';
import { DecisionTree, Exists, TreeEdgesObj, TreeNodes } from '@/types/DecisionTree';

describe('treeBuilder', () => {
  const decisionTree: DecisionTree = {
    files: {
      panel: {
        path: 'path/to/tsv'
      }
    },
    rootNode: 'ROOT',
    nodes: {
      boolNode: {
        type: 'BOOL',
        description: 'Bool type node',
        query: {
          field: 'field',
          operator: '==',
          value: 'val'
        },
        outcomeTrue: {
          nextNode: 'exit_f'
        },
        outcomeFalse: {
          nextNode: 'existsNode'
        },
        outcomeMissing: {
          nextNode: 'existsNode'
        }
      },
      boolMultiNode: {
        type: 'BOOL_MULTI',
        description: 'Bool multi type node',
        fields: ['my_multi_1', 'my_multi_2'],
        outcomeDefault: {
          nextNode: 'exit_t'
        },
        outcomeMissing: {
          nextNode: 'exit_f'
        },
        outcomes: [
          {
            operator: 'AND',
            queries: [
              {
                field: 'my_multi_1',
                operator: '>',
                value: 0.1
              },
              {
                field: 'my_multi_1',
                operator: '<=',
                value: 0.2
              }
            ],
            outcomeTrue: {
              nextNode: 'exit_f'
            }
          },
          {
            operator: 'OR',
            queries: [
              {
                field: 'my_multi_2',
                operator: '<',
                value: 0.1
              },
              {
                field: 'my_multi_2',
                operator: '>',
                value: 0.2
              }
            ],
            outcomeTrue: {
              nextNode: 'exit_t'
            }
          }
        ]
      },
      existsNode: {
        type: 'EXISTS',
        description: 'check some field exists',
        field: 'Some field',
        outcomeTrue: {
          nextNode: 'categorical_field'
        },
        outcomeFalse: {
          nextNode: 'categorical_field'
        }
      },
      categoricalField: {
        type: 'CATEGORICAL',
        description: 'check categorical field',
        field: 'FIELD_TO_CHECK',
        outcomeMap: {
          P: {
            nextNode: 'exit_t'
          },
          LP: {
            nextNode: 'exit_t'
          },
          LB: {
            nextNode: 'exit_f'
          },
          B: {
            nextNode: 'exit_f'
          }
        },
        outcomeMissing: {
          nextNode: 'exit_t'
        },
        outcomeDefault: {
          nextNode: 'exit_t'
        }
      },
      exit_t: {
        type: 'LEAF',
        class: 'T'
      },
      exit_f: {
        type: 'LEAF',
        class: 'F'
      }
    }
  };
  it('should return correct node structure', () => {
    const nodes: TreeNodes = retrieveNodes(decisionTree);
    const expected: TreeNodes = [
      {
        id: 'boolNode',
        label: 'boolNode\n(== val)',
        type: 'BOOL'
      },
      {
        id: 'boolMultiNode',
        label: 'boolMultiNode',
        type: 'BOOL_MULTI'
      },
      {
        id: 'existsNode',
        label: 'existsNode\n(exists)',
        type: 'EXISTS'
      },
      {
        id: 'categoricalField',
        label: 'categoricalField',
        type: 'CATEGORICAL'
      },
      {
        id: 'exit_t',
        label: 'exit_t',
        type: 'LEAF'
      },
      {
        id: 'exit_f',
        label: 'exit_f',
        type: 'LEAF'
      }
    ];
    expect(nodes).toStrictEqual(expected);
  });
  it('should return the node label for a query type', () => {
    const query = {
      field: 'field',
      operator: '==',
      value: 'value1'
    };
    const actual = getNodeLabel('label', 'BOOL', query);
    const expected = 'label\n(== value1)';
    expect(actual).toEqual(expected);
  });
  it('should return the node label for a exists type', () => {
    const actual = getNodeLabel('label', 'EXISTS', undefined);
    const expected = 'label\n(exists)';
    expect(actual).toEqual(expected);
  });
  it('should return the node label for a leaf type', () => {
    const actual = getNodeLabel('label', 'LEAF', undefined);
    const expected = 'label';
    expect(actual).toEqual(expected);
  });
  it('should create a simple edge', () => {
    const type: Exists = 'EXISTS';
    const node = {
      description: 'description',
      type: type,
      field: 'field',
      outcomeTrue: { nextNode: 'trueNode' },
      outcomeFalse: { nextNode: 'falseNode' }
    };
    const edges = {};
    const actual = createSimpleEdge('True', node, 'key1', edges);
    const expected = { key1_trueNode: { from: 'key1', to: 'trueNode', label: 'True' } };
    expect(actual).toStrictEqual(expected);
  });
  it('should add to a simple edge', () => {
    const type: Exists = 'EXISTS';
    const node = {
      description: 'description',
      type: type,
      field: 'field',
      outcomeTrue: { nextNode: 'trueNode' },
      outcomeFalse: { nextNode: 'trueNode' }
    };
    const edges = { key1_trueNode: { from: 'key1', to: 'trueNode', label: 'True' } };
    const actual = createSimpleEdge('False', node, 'key1', edges);
    const expected = { key1_trueNode: { from: 'key1', to: 'trueNode', label: 'True\nFalse' } };
    expect(actual).toStrictEqual(expected);
  });
  it('should generate edge', () => {
    const nextNode = 'exit';
    const label = 'label';
    const key = 'current';
    const edges: TreeEdgesObj = {};
    const outcome = createEdge(nextNode, label, key, edges);
    const expected = {
      current_exit: {
        from: key,
        to: nextNode,
        label: label
      }
    };
    expect(outcome).toStrictEqual(expected);
  });
  it('should generate edges', () => {
    const outcome = retrieveEdges(decisionTree);
    const expected = [
      {
        from: 'boolNode',
        to: 'exit_f',
        label: 'True'
      },
      {
        from: 'boolNode',
        to: 'existsNode',
        label: 'False\nMissing'
      },
      {
        from: 'boolMultiNode',
        to: 'exit_f',
        label: 'my_multi_1 > 0.1 AND my_multi_1 <= 0.2\nMissing'
      },
      {
        from: 'boolMultiNode',
        to: 'exit_t',
        label: 'my_multi_2 < 0.1 OR my_multi_2 > 0.2\nDefault'
      },
      {
        from: 'existsNode',
        to: 'categorical_field',
        label: 'True\nFalse'
      },
      {
        from: 'categoricalField',
        to: 'exit_t',
        label: 'P\nLP\nMissing\nDefault'
      },
      {
        from: 'categoricalField',
        to: 'exit_f',
        label: 'LB\nB'
      }
    ];
    expect(outcome).toStrictEqual(expected);
  });
  it('should generate edges for CATEGORICAL node without default/missing', () => {
    const decisionTree: DecisionTree = {
      files: {
        panel: {
          path: 'path/to/tsv'
        }
      },
      rootNode: 'ROOT',
      nodes: {
        categoricalField: {
          type: 'CATEGORICAL',
          description: 'check categorical field',
          field: 'FIELD_TO_CHECK',
          outcomeMap: {
            P: {
              nextNode: 'exit_t'
            },
            LP: {
              nextNode: 'exit_t'
            },
            LB: {
              nextNode: 'exit_f'
            },
            B: {
              nextNode: 'exit_f'
            }
          }
        },
        exit_t: {
          type: 'LEAF',
          class: 'T'
        },
        exit_f: {
          type: 'LEAF',
          class: 'F'
        }
      }
    };

    const outcome = retrieveEdges(decisionTree);
    const expected = [
      {
        from: 'categoricalField',
        to: 'exit_t',
        label: 'P\nLP'
      },
      {
        from: 'categoricalField',
        to: 'exit_f',
        label: 'LB\nB'
      }
    ];
    expect(outcome).toStrictEqual(expected);
  });
});
