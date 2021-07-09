import treeDrawer from '@/utils/treeDrawer';

describe('retrieveTreeFromFile', () => {
  it('getLineThickness', () => {
    const actual = treeDrawer.getLineThickness(10);
    expect(actual).toEqual(1);
  });
  it('getBarHeightFromFontSize', () => {
    const actual = treeDrawer.getBarHeightFromFontSize(12);
    expect(actual).toEqual(36);
  });
  it('getFontSizeFromBarHeight', () => {
    const actual = treeDrawer.getFontSizeFromBarHeight(12);
    expect(actual).toEqual(4);
  });
  it('getNode', () => {
    treeDrawer.getTextWidth = jest.fn().mockReturnValue(42);
    const actual = treeDrawer.getNode('node', 10, 'BOOL', 'Arial');
    const expected = {
      label: 'node',
      type: 'BOOL',
      width: 70,
      height: 30
    };
    expect(actual).toEqual(expected);
  });
  it('getMiddleEdgeIndex', () => {
    const actual = treeDrawer.getMiddleEdgeIndex([
      {
        x: 1,
        y: 1
      },
      {
        x: 2,
        y: 2
      },
      {
        x: 3,
        y: 3
      }
    ]);
    expect(actual).toEqual(1);
  });
  it('getEdgeLabelXPos', () => {
    const actual = treeDrawer.getEdgeLabelXPos(84, 42);
    expect(actual).toEqual(107);
  });
  it('getEdgeLabelYPos', () => {
    const actual = treeDrawer.getEdgeLabelYPos(42, 1, 10);
    expect(actual).toEqual(62);
  });
  it('getNodeXPos', () => {
    const actual = treeDrawer.getNodeXPos(84, 42);
    expect(actual).toEqual(63);
  });
  it('getNodeLabelYPos', () => {
    const actual = treeDrawer.getNodeLabelYPos(42, 10);
    expect(actual).toEqual(62);
  });
  it('getXPos', () => {
    const actual = treeDrawer.getXPos(42, 42);
    expect(actual).toEqual(84);
  });
});
