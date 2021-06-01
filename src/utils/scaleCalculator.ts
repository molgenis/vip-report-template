export const calculateWidthScale = (svgWidth: number, graphWidth: number, initialScale: number): number => {
  return (svgWidth - graphWidth * initialScale) / 2
}

export const calculateHeightScale = (graphHeight: number, initialScale: number): number => {
  return graphHeight * initialScale + 40
}
