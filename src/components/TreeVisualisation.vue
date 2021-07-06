<template>
  <div class="d3-tree-visualisation"></div>
</template>

<script lang="ts">
import Vue from 'vue';

import { select } from 'd3-selection';
import graphlib from 'dagre/lib/graphlib';
import * as layout from 'dagre/lib/layout';
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder';
import { DecisionTree, TreeEdgesArray, TreeNodes } from '@/types/DecisionTree';
import { TreeGraph } from '@/types/dagre';
import { D3SVGSelection } from '@/types/d3';
import { getNode, drawNodes, drawEdges, getBarHeightFromFontSize, defineCanvas, defineZoom } from '@/utils/treeDrawer';

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
    canvasWidth: {
      default: window.screen.width - 350
    },
    canvasHeight: {
      default: window.screen.height - 200
    }
  },
  mounted(): void {
    this.render(this.nodes, this.edges);
  },
  data(): { svg: D3SVGSelection } {
    return {
      svg: {}
    };
  },
  computed: {
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
    defineNodes(nodes: TreeNodes, g: TreeGraph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, getNode(node.label, this.fontSize, this.font));
      });
    },
    defineEdges(edges: TreeEdgesArray, g: TreeGraph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to, { label: edge.label });
      });
    },
    setSvg(): void {
      this.svg = defineCanvas(select(this.$el), this.canvasWidth, this.canvasHeight);
    },
    generateGraph(nodes: TreeNodes, edges: TreeEdgesArray) {
      const g: TreeGraph = new graphlib.Graph();
      g.setGraph({});
      g.setDefaultEdgeLabel(() => {
        return {};
      });
      this.defineNodes(nodes, g);
      this.defineEdges(edges, g);
      layout(g);
      return g;
    },
    drawGraph(g: TreeGraph) {
      this.setSvg();
      drawNodes(this.svg, g, this.fontSize, this.nodeColour, this.nodeTextColour);
      drawEdges(this.svg, g, this.barHeight, this.font);
      const graphZoom = defineZoom(this.svg, 0.2, 8);
      this.svg.call(graphZoom);
    },
    render(nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: TreeGraph = this.generateGraph(nodes, edges);
      this.drawGraph(g);
    },
    refresh(): void {
      this.svg.remove();
      this.render(this.nodes, this.edges);
    }
  }
});
</script>

<style scoped>
.d3-tree-visualisation {
  font-size: 10px;
}
.d3-tree-visualisation svg {
  display: block;
  margin: auto;
}
</style>
