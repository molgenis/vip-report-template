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
      width: 52,
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
    const actual = treeDrawer.getEdgeLabelYPos(42, 1, 10, 10);
    expect(actual).toEqual(72);
  });
  it('getNodeXPos', () => {
    const actual = treeDrawer.getNodeXPos(84, 42);
    expect(actual).toEqual(63);
  });
  it('getNodeLabelYPos', () => {
    const actual = treeDrawer.getNodeLabelYPos(42, 1, 10, 2);
    expect(actual).toEqual(67);
  });
  it('getXPos', () => {
    const actual = treeDrawer.getXPos(42, 42);
    expect(actual).toEqual(84);
  });
  it('getYPos', () => {
    const actual = treeDrawer.getYPos(42, 20, 42);
    expect(actual).toEqual(94);
  });
  it('getLongestLabelPart', () => {
    const actual = treeDrawer.getLongestLabelPart('this is a long label\nhello!');
    expect(actual).toEqual('this is a long label');
  });
  it('getCoordinates', () => {
    const actual = treeDrawer.getCoordinates(42, 42, 42, 42, 42, 42, 20);
    expect(actual).toEqual({ x1: 84, x2: 84, y1: 94, y2: 94 });
  });
  it('getXOffset when vertical svg > graph', () => {
    const actual = treeDrawer.getXOffset(20, 10, false);
    expect(actual).toEqual(5);
  });
  it('getXOffset when vertical svg < graph', () => {
    const actual = treeDrawer.getXOffset(20, 30, false);
    expect(actual).toEqual(100);
  });
  it('getXOffset when horizontal', () => {
    const actual = treeDrawer.getXOffset(20, 10, true);
    expect(actual).toEqual(25);
  });
  it('getYOffset when horizontal', () => {
    const actual = treeDrawer.getYOffset(20, 10, true);
    expect(actual).toEqual(5);
  });
  it('getYOffset when vertical when svg > graph', () => {
    const actual = treeDrawer.getYOffset(20, 10, false);
    expect(actual).toEqual(5);
  });
  it('getYOffset when vertical when svg < graph', () => {
    const actual = treeDrawer.getYOffset(10, 20, false);
    expect(actual).toEqual(0);
  });
});
