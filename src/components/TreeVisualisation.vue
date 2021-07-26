<template>
  <div class="d3-tree-visualisation">
    <b-button class="btn-xs float-right" v-b-tooltip.click :title="$t('treeInfo')">
      <b-icon-info-circle />
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { BIconInfoCircle } from 'bootstrap-vue';
import { select, Selection } from 'd3-selection';
import graphlib from 'dagre/lib/graphlib';
import * as layout from 'dagre/lib/layout';
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder';
import { DecisionTree, TreeEdgesArray, TreeNodes } from '@/types/DecisionTree';
import { Graph } from '@dagrejs/graphlib';
import { getNode, drawNodes, drawEdges, getBarHeightFromFontSize, defineCanvas, defineZoom } from '@/utils/treeDrawer';

Vue.component('BIconInfoCircle', BIconInfoCircle);

export default Vue.extend({
  name: 'TreeVisualisation',
  props: {
    tree: String,
    width: {
      type: Number,
      required: false
    },
    height: {
      type: Number,
      required: false
    }
  },
  mounted(): void {
    this.render(this.nodes, this.edges);
  },
  created(): void {
    window.addEventListener('resize', this.refresh);
  },
  destroyed(): void {
    window.removeEventListener('resize', this.refresh);
  },
  data(): {
    graphWidth: number;
    svg: Selection<SVGSVGElement, never, null, undefined> | undefined;
    clientWidth: number;
    clientHeight: number;
  } {
    return {
      graphWidth: 0,
      svg: undefined,
      clientWidth: 0,
      clientHeight: 0
    };
  },
  computed: {
    svgWidth: {
      set(clientWidth: number): void {
        this.clientWidth = clientWidth;
      },
      get(): number {
        return this.width ? this.width : this.clientWidth;
      }
    },
    svgHeight: {
      set(clientHeight: number): void {
        this.clientHeight = clientHeight;
      },
      get(): number {
        return this.height ? this.height : this.clientHeight;
      }
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
    setSvg() {
      this.svg = defineCanvas(select(this.$el), this.svgWidth, this.svgHeight);
    },
    getCss(property: string) {
      const element = select(this.$el).node();
      if (element) {
        return window.getComputedStyle(element).getPropertyValue(property);
      }
    },
    defineNodes(nodes: TreeNodes, g: Graph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, getNode(node.label, this.fontSize, node.type, this.font));
      });
    },
    defineEdges(edges: TreeEdgesArray, g: Graph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to, { label: edge.label });
      });
    },
    generateGraph(nodes: TreeNodes, edges: TreeEdgesArray) {
      const g: Graph = new graphlib.Graph();
      g.setGraph({});
      this.defineNodes(nodes, g);
      this.defineEdges(edges, g);
      layout(g);
      this.graphWidth = g.graph().width;
      return g;
    },
    drawGraph(g: Graph) {
      if (this.svg) {
        drawNodes(this.svg, g, this.fontSize, this.graphWidth);
        drawEdges(this.svg, g, this.barHeight, this.font, this.graphWidth);
        const graphZoom = defineZoom(this.svg, 0.2, 8);
        this.svg.call(graphZoom);
      } else {
        this.refresh();
      }
    },
    render(nodes: TreeNodes, edges: TreeEdgesArray): void {
      this.svgWidth = (document.documentElement.clientWidth || document.body.clientWidth) - 100;
      this.svgHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 100;
      this.setSvg();
      const g: Graph = this.generateGraph(nodes, edges);
      this.drawGraph(g);
    },
    refresh(): void {
      if (this.svg) {
        this.svg.remove();
      }
      this.render(this.nodes, this.edges);
    }
  }
});
</script>
