import * as d3 from 'd3'

export type D3SVGSelection = d3.Selection<Element, never, null, never> | Record<string, never> | Selection<SVGSVGElement, unknown, null, undefined>
export type D3GSelection = d3.Selection<SVGGElement, never, SVGSVGElement | null, never>
