import { zoom, ZoomBehavior } from 'd3-zoom';
import { Edge, Graph } from '@dagrejs/graphlib';
import { Selection } from 'd3-selection';

/**
 * Functions that calculate reference sizes
 */
const fontSizeToBarHeightRatio = 3;

const nodeSideMargin = 5;

const getLineThickness = (fontSize: number): number => {
  return fontSize / 10;
};

export const getBarHeightFromFontSize = (fontSize: number): number => {
  return fontSizeToBarHeightRatio * fontSize;
};

const getFontSizeFromBarHeight = (barHeight: number): number => {
  return barHeight / fontSizeToBarHeightRatio;
};

const getMiddleEdgeIndex = (edges: { x: number; y: number }[]): number => {
  return Math.floor(edges.length / 2);
};

/**
 * Functions that calculate y positions
 */
const getEdgeLabelYPos = (y: number, index: number, fontSize: number): number => {
  return y + index * fontSize + fontSize;
};

const getNodeLabelYPos = (y: number, index: number, fontSize: number, labelLength: number): number => {
  const margin = (getBarHeightFromFontSize(fontSize) - labelLength * fontSize) / 2;
  return y + index * fontSize + fontSize + margin;
};

/**
 * Functions that calculate x positions
 */
const getXPos = (x: number, xOffset: number): number => {
  return x + xOffset;
};

const getEdgeLabelXPos = (xPos: number, textWidth: number): number => {
  return xPos + textWidth / 2 + 2;
};

const getNodeXPos = (xPos: number, width: number): number => {
  return xPos - width / 2;
};

/**
 * Functions retrieve the sizes of elements on the screen
 */
const getXOffset = (svg: Selection<SVGSVGElement, never, null, undefined>, graphWidth: number) => {
  // Center the graph in the canvas
  const svgWidth = Number(svg.style('width').replace('px', ''));
  return svgWidth > graphWidth ? (svgWidth - graphWidth) / 2 : 0;
};

const getTextWidth = (innerText: string, fontSize: number, font: string): number => {
  const text = document.createElement('span');
  document.body.appendChild(text);
  text.style.font = font;
  text.style.fontSize = fontSize + 'px';
  text.style.height = 'auto';
  text.style.width = 'auto';
  text.style.position = 'absolute';
  text.style.whiteSpace = 'no-wrap';
  text.innerHTML = innerText;
  const width = Math.ceil(text.clientWidth);
  document.body.removeChild(text);
  return width;
};

/**
 * Helper functions
 * */
const getLongestLabelPart = (label: string): string => {
  return label.split('\n').reduce((a, b) => {
    return a.length > b.length ? a : b;
  });
};

/**
 * Functions define data to prepare for drawing
 */
export const getNode = (
  label: string,
  fontSize: number,
  type: string,
  font: string
): { width: number; label: string; type: string; height: number } => {
  const longestLabel = getLongestLabelPart(label);
  const textWidth = exportFunctions.getTextWidth(longestLabel, fontSize, font);
  const barHeight = getBarHeightFromFontSize(fontSize);
  return {
    label: label,
    width: textWidth + 2 * nodeSideMargin,
    type: type,
    height: barHeight
  };
};

/**
 * Functions that define elements (that help) to draw on the screen
 */
const drawLine = (
  svg: Selection<SVGSVGElement, never, null, undefined>,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeWidth: number
) => {
  return svg
    .append('line')
    .style('stroke', 'black')
    .style('stroke-width', strokeWidth)
    .attr('x1', x1)
    .attr('y1', y1)
    .attr('x2', x2)
    .attr('y2', y2);
};

const drawNode = (
  gElement: Selection<SVGGElement, never, null, undefined>,
  x: number,
  y: number,
  width: number,
  height: number,
  isExitNode: boolean
) => {
  const nodeClass = isExitNode ? 'tree-exit-node' : 'tree-node';
  gElement
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'black')
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('class', nodeClass);
};

const addLabel = (
  gElement: Selection<SVGGElement, never, null, undefined> | Selection<SVGSVGElement, never, null, undefined>,
  x: number,
  y: number,
  label: string,
  fontSize: number,
  nodeLabelClass: string
) => {
  gElement
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('class', nodeLabelClass)
    .style('font-size', `${fontSize}px`)
    .style('text-anchor', 'middle')
    .text(label);
};

const defineArrowHead = (svg: Selection<SVGSVGElement, never, null, undefined>) => {
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0, 0, 10, 10')
    .attr('refX', 9)
    .attr('refY', 5)
    .attr('markerWidth', 8)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 0 10 L 10 5')
    .attr('stroke', 'black');
};

export const defineCanvas = (
  element: Selection<Element, never, null, undefined>,
  canvasWidth: number,
  canvasHeight: number
): Selection<SVGSVGElement, never, null, undefined> => {
  return element.append('svg').attr('width', canvasWidth).attr('height', canvasHeight);
};

export const defineZoom = (
  svg: Selection<SVGSVGElement, never, null, undefined>,
  min: number,
  max: number
): ZoomBehavior<SVGSVGElement, never> => {
  return zoom<SVGSVGElement, never>()
    .scaleExtent([min, max])
    .on('zoom', (event) => {
      svg.selectAll('line').attr('transform', event.transform);
      svg.selectAll('rect').attr('transform', event.transform);
      svg.selectAll('text').attr('transform', event.transform);
    });
};

const addEdgeLabels = (
  barHeight: number,
  g: Graph,
  e: Edge,
  font: string,
  value: { x: number; y: number },
  xOffset: number,
  svg: Selection<SVGSVGElement, never, null, undefined>
) => {
  const fontSize = getFontSizeFromBarHeight(barHeight);
  const labels = g.edge(e).label.split('\n');
  const longestLabel = getLongestLabelPart(g.edge(e).label);
  const textWidth = exportFunctions.getTextWidth(longestLabel, fontSize, font);
  for (const [labelIndex, label] of labels.entries()) {
    const xPos = getEdgeLabelXPos(getXPos(value.x, xOffset), textWidth);
    const yPos = getEdgeLabelYPos(value.y, labelIndex, fontSize);
    addLabel(svg, xPos, yPos, label, fontSize, 'tree-edge-label');
  }
};

/**
 * Functions that go through the nodes and edges to draw them on the screen
 */
export const drawNodes = (
  svg: Selection<SVGSVGElement, never, null, undefined>,
  g: Graph,
  fontSize: number,
  graphWidth: number
): void => {
  const xOffset = getXOffset(svg, graphWidth);
  g.nodes().forEach((v: string) => {
    const node = g.node(v);
    if (node.x && node.y) {
      const gElement = svg.append('g');
      const xPos = getXPos(node.x, xOffset);
      const isExitNode = node.type === 'LEAF';
      drawNode(gElement, getNodeXPos(xPos, node.width), node.y, node.width, node.height, isExitNode);
      const labels = node.label.split('\n');
      for (const [labelIndex, label] of labels.entries()) {
        const yPos = getNodeLabelYPos(node.y, labelIndex, fontSize, labels.length);
        const nodeLabelClass = isExitNode ? 'tree-exit-node-label' : 'tree-node-label';
        addLabel(gElement, xPos, yPos, label, fontSize, nodeLabelClass);
      }
    }
  });
};

export const drawEdges = (
  svg: Selection<SVGSVGElement, never, null, undefined>,
  g: Graph,
  barHeight: number,
  font: string,
  graphWidth: number
): void => {
  const xOffset = getXOffset(svg, graphWidth);
  g.edges().forEach((e: Edge) => {
    const points = g.edge(e).points;
    if (points) {
      for (const [nodeIndex, value] of points.entries()) {
        const nextNodeIndex = nodeIndex + 1;
        if (nextNodeIndex !== points.length) {
          const x1 = getXPos(value.x, xOffset);
          const y1 = value.y + barHeight / 2;
          const x2 = getXPos(points[nextNodeIndex].x, xOffset);
          const y2 = points[nextNodeIndex].y + barHeight / 2;
          const lineThickness = getLineThickness(getFontSizeFromBarHeight(barHeight));
          const drawnLine = drawLine(svg, x1, y1, x2, y2, lineThickness);
          // if line == last line (node is 0  based, length is 1 based), add arrowhead
          if (nextNodeIndex === points.length - 1) {
            defineArrowHead(svg);
            drawnLine.attr('marker-end', 'url(#arrow)').attr('fill', 'none');
          }
          if (nodeIndex === getMiddleEdgeIndex(points)) {
            addEdgeLabels(barHeight, g, e, font, value, xOffset, svg);
          }
        }
      }
    }
  });
};

const exportFunctions = {
  getLineThickness,
  getBarHeightFromFontSize,
  getFontSizeFromBarHeight,
  getNode,
  getTextWidth,
  getMiddleEdgeIndex,
  getEdgeLabelXPos,
  getEdgeLabelYPos,
  getNodeXPos,
  getNodeLabelYPos,
  getXPos,
  getLongestLabelPart
};

export default exportFunctions;
