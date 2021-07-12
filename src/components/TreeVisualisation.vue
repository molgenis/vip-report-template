<template>
  <div class="d3-tree-visualisation"></div>
</template>

<script lang="ts">
import Vue from 'vue';

import { select, Selection } from 'd3-selection';
import graphlib from 'dagre/lib/graphlib';
import * as layout from 'dagre/lib/layout';
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder';
import { DecisionTree, TreeEdgesArray, TreeNodes } from '@/types/DecisionTree';
import { getNode, drawNodes, drawEdges, getBarHeightFromFontSize, defineCanvas, defineZoom } from '@/utils/treeDrawer';
import { DagreGraph } from '@/types/Graph';

export default Vue.extend({
  name: 'TreeVisualisation',
  props: {
    tree: String,
    nodeColour: {
      default: '#6c757d'
    },
    nodeTextColour: {
      default: '#fff'
    },
    exitNodeColour: {
      default: '#007bff'
    },
    exitNodeTextColour: {
      default: '#fff'
    },
    canvasWidth: {
      default: window.screen.width - 200
    },
    canvasHeight: {
      default: window.screen.height - 200
    }
  },
  mounted(): void {
    this.render(this.nodes, this.edges);
  },
  data(): { graphWidth: number } {
    return {
      graphWidth: 0
    };
  },
  computed: {
    svg(): Selection<SVGSVGElement, never, null, undefined> {
      return defineCanvas(select(this.$el), this.canvasWidth, this.canvasHeight);
    },
    fontSize(): number {
      const fontSize = this.getCss('font-size');
      return fontSize ? Number(fontSize.replace('px', '')) : 10;
    },
    font(): string {
      const font = this.getCss('font');
      return font || 'Avenir, Helvetica, Arial, sans-serif';
    },
    barHeight(): number {
      return getBarHeightFromFontSize(this.fontSize);
    },
    jsonTree(): DecisionTree {
      return JSON.parse(this.tree);
    },
    nodes(): TreeNodes {
      return retrieveNodes(this.jsonTree);
    },
    edges(): TreeEdgesArray {
      return retrieveEdges(this.jsonTree);
    }
  },
  watch: {
    nodes(): void {
      this.refresh();
    },
    edges(): void {
      this.refresh();
    }
  },
  methods: {
    getCss(property: string) {
      const element = select(this.$el).node();
      if (element) {
        return window.getComputedStyle(element).getPropertyValue(property);
      }
    },
    defineNodes(nodes: TreeNodes, g: DagreGraph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, getNode(node.label, this.fontSize, node.type, this.font));
      });
    },
    defineEdges(edges: TreeEdgesArray, g: DagreGraph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to, { label: edge.label });
      });
    },
    generateGraph(nodes: TreeNodes, edges: TreeEdgesArray) {
      const g: DagreGraph = new graphlib.Graph();
      g.setGraph({});
      g.setDefaultEdgeLabel(() => {
        return {};
      });
      this.defineNodes(nodes, g);
      this.defineEdges(edges, g);
      layout(g);
      this.graphWidth = g.graph().width;
      return g;
    },
    drawGraph(g: DagreGraph) {
      drawNodes(
        this.svg,
        g,
        this.fontSize,
        {
          backgroundColour: this.nodeColour,
          textColour: this.nodeTextColour,
          exitBackgroundColour: this.exitNodeColour,
          exitTextColour: this.exitNodeTextColour
        },
        this.graphWidth
      );
      drawEdges(this.svg, g, this.barHeight, this.font, this.graphWidth);
      const graphZoom = defineZoom(this.svg, 0.2, 8);
      this.svg.call(graphZoom);
    },
    render(nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: DagreGraph = this.generateGraph(nodes, edges);
      this.drawGraph(g);
    },
    refresh(): void {
      this.svg.remove();
      this.render(this.nodes, this.edges);
    }
  }
});
</script>

<style>
.d3-tree-visualisation {
  font-size: 10px;
}

.d3-tree-visualisation svg {
  display: block;
  margin: auto;
}
</style>
