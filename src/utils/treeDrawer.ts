import { D3SVGSelection } from '@/types/d3';
import { TreeGraph } from '@/types/dagre';
import { line } from 'd3-shape';
import { zoom, ZoomBehavior, ZoomedElementBaseType } from 'd3-zoom';

/**
 * Functions that calculate reference sizes
 */
const fontSizeToBarHeightRatio = 3;

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

const getNodeLabelYPos = (y: number, fontSize: number): number => {
  return y + fontSize * 2;
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
const getXOffset = (svg: D3SVGSelection) => {
  // Get the third of the canvas to center the graph
  return Number(svg.style('width').replace('px', '')) / 3.5;
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
 * Functions define data to prepare for drawing
 */
export const getNode = (
  label: string,
  fontSize: number,
  font: string
): { label: string; width: number; height: number } => {
  const textWidth = exportFunctions.getTextWidth(label, fontSize, font);
  const barHeight = getBarHeightFromFontSize(fontSize);
  return {
    label: label,
    width: textWidth + (textWidth / fontSizeToBarHeightRatio) * 2,
    height: barHeight
  };
};

/**
 * Functions that define elements (that help) to draw on the screen
 */
const drawLine = (svg: D3SVGSelection, x1: number, y1: number, x2: number, y2: number, strokeWidth: number) => {
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
  gElement: D3SVGSelection,
  x: number,
  y: number,
  width: number,
  height: number,
  backgroundColour: string
) => {
  gElement
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke', 'black')
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', backgroundColour);
};

const addLabel = (
  gElement: D3SVGSelection,
  x: number,
  y: number,
  label: string,
  fontSize: number,
  textColour: string
) => {
  gElement
    .append('text')
    .attr('x', x)
    .attr('y', y)
    .attr('fill', textColour)
    .style('font-size', `${fontSize}px`)
    .style('text-anchor', 'middle')
    .text(label);
};

const defineArrowHead = (svg: D3SVGSelection) => {
  const arrowPoints: Iterable<[number, number]> = [
    [0, 0],
    [0, 10],
    [10, 5]
  ];
  svg
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, 10, 10])
    .attr('refX', 9)
    .attr('refY', 5)
    .attr('markerWidth', 8)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', line()(arrowPoints))
    .attr('stroke', 'black');
};

export const defineCanvas = (element: D3SVGSelection, canvasWidth: number, canvasHeight: number): D3SVGSelection => {
  return element.append('svg').attr('width', canvasWidth).attr('height', canvasHeight);
};

export const defineZoom = (
  svg: D3SVGSelection,
  min: number,
  max: number
): ZoomBehavior<ZoomedElementBaseType, unknown> => {
  return zoom()
    .scaleExtent([min, max])
    .on('zoom', (event) => {
      svg.selectAll('line').attr('transform', event.transform);
      svg.selectAll('rect').attr('transform', event.transform);
      svg.selectAll('text').attr('transform', event.transform);
    });
};

/**
 * Functions that go through the nodes and edges to draw them on the screen
 */
export const drawNodes = (
  svg: D3SVGSelection,
  g: TreeGraph,
  fontSize: number,
  backgroundColour: string,
  textColour: string
): void => {
  const xOffset = getXOffset(svg);
  g.nodes().forEach((v: string) => {
    const node = g.node(v);
    const gElement = svg.append('g');
    const xPos = getXPos(node.x, xOffset);
    drawNode(gElement, getNodeXPos(xPos, node.width), node.y, node.width, node.height, backgroundColour);
    addLabel(gElement, xPos, getNodeLabelYPos(node.y, fontSize), node.label, fontSize, textColour);
  });
};

export const drawEdges = (svg: D3SVGSelection, g: TreeGraph, barHeight: number, font: string): void => {
  const xOffset = getXOffset(svg);
  g.edges().forEach((e: string) => {
    const points = g.edge(e).points;
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
          const fontSize = getFontSizeFromBarHeight(barHeight);
          const labels = g.edge(e).label.split('\n');
          for (const [labelIndex, label] of labels.entries()) {
            const xPos = getEdgeLabelXPos(getXPos(value.x, xOffset), getTextWidth(label, fontSize, font));
            const yPos = getEdgeLabelYPos(value.y, labelIndex, fontSize);
            addLabel(svg, xPos, yPos, label, fontSize, '#000');
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
  getXPos
};

export default exportFunctions;
