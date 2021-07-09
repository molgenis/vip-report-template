import { createEdge, retrieveEdges, retrieveNodes } from '@/utils/treeBuilder';
import { DecisionTree, TreeEdgesObj, TreeNodes } from '@/types/DecisionTree';

describe('retrieveTreeFromFile', () => {
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
        label: 'boolNode',
        type: 'BOOL'
      },
      {
        id: 'existsNode',
        label: 'existsNode',
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
});
