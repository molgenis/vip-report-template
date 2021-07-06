import { Selection as d3Selection } from 'd3';

export type D3SVGSelection =
  | d3Selection<Element, never, null, never>
  | Record<string, never>
  | Selection<SVGSVGElement, unknown, null, undefined>;
