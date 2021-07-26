<template>
  <div class="d3-tree-visualisation">
    <b-button-group vertical class="float-right">
      <b-button class="btn-xs" v-b-tooltip.click :title="$t('treeInfo')">
        <b-icon-info-circle />
      </b-button>
      <b-button class="btn-xs">
        <b-icon-arrow-repeat @click="horizontal = !horizontal" />
      </b-button>
      <b-button class="btn-xs" @click="fitOnScreen ? resetZoom() : zoomToFit()">
        <b-icon-box-arrow-up-right v-if="fitOnScreen" />
        <b-icon-box-arrow-in-down-left v-else />
      </b-button>
    </b-button-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {
  BIconInfoCircle,
  BIconArrowRepeat,
  BIconBoxArrowInDownLeft,
  BIconBoxArrowUpRight,
  BButtonGroup
} from 'bootstrap-vue';
import { select as d3Select, Selection } from 'd3-selection';
import { transition as d3Transition } from 'd3-transition';
import graphlib from 'dagre/lib/graphlib';
import * as layout from 'dagre/lib/layout';
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder';
import { DecisionTree, TreeEdgesArray, TreeNodes } from '@/types/DecisionTree';
import { Graph } from '@dagrejs/graphlib';
import { getNode, drawNodes, drawEdges, getBarHeightFromFontSize, defineCanvas, defineZoom } from '@/utils/treeDrawer';
import { ZoomBehavior, zoomIdentity } from 'd3-zoom';

d3Select.prototype.transition = d3Transition;

Vue.component('BIconInfoCircle', BIconInfoCircle);
Vue.component('BIconArrowRepeat', BIconArrowRepeat);
Vue.component('BIconBoxArrowInDownLeft', BIconBoxArrowInDownLeft);
Vue.component('BIconBoxArrowUpRight', BIconBoxArrowUpRight);

export default Vue.extend({
  name: 'TreeVisualisation',
  components: {
    BButtonGroup
  },
  props: {
    tree: String,
    canvasWidth: {
      default: window.screen.width - 100
    },
    canvasHeight: {
      default: window.screen.height - 200
    }
  },
  mounted(): void {
    this.render(this.nodes, this.edges);
  },
  data(): {
    graphWidth: number;
    graphHeight: number;
    graphZoom: ZoomBehavior<SVGSVGElement, never> | undefined;
    fitOnScreen: boolean;
    horizontal: boolean;
  } {
    return {
      graphWidth: 0,
      graphHeight: 0,
      graphZoom: undefined,
      fitOnScreen: false,
      horizontal: false
    };
  },
  computed: {
    svg(): Selection<SVGSVGElement, never, null, undefined> {
      const el = d3Select(this.$el);
      console.log(el); // fix this please!
      return defineCanvas(d3Select(this.$el), this.canvasWidth, this.canvasHeight);
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
    },
    horizontal(): void {
      this.refresh();
    }
  },
  methods: {
    zoomToFit() {
      const height = this.canvasHeight / (this.graphHeight + 50);
      const width = this.canvasWidth / (this.graphWidth + 50);
      const scale = Math.min(height, width);
      if (this.graphZoom) {
        this.graphZoom.scaleBy(this.svg.transition().duration(750), scale, [width / 2, 0]);
        this.fitOnScreen = true;
      }
    },
    resetZoom() {
      if (this.graphZoom) {
        this.svg.transition().duration(750).call(this.graphZoom.transform, zoomIdentity);
        this.fitOnScreen = false;
      }
    },
    getCss(property: string) {
      const element = d3Select(this.$el).node();
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
      if (this.horizontal) {
        g.graph().rankdir = 'LR';
      }
      layout(g);
      this.graphWidth = g.graph().width;
      this.graphHeight = g.graph().height;
      return g;
    },
    drawGraph(g: Graph) {
      drawNodes(this.svg, g, this.fontSize, this.graphWidth);
      drawEdges(this.svg, g, this.barHeight, this.font, this.graphWidth);
      this.graphZoom = defineZoom(this.svg, 0.2, 8);
      this.svg.call(this.graphZoom);
    },
    render(nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: Graph = this.generateGraph(nodes, edges);
      console.log(g, this.nodes, this.edges);
      this.drawGraph(g);
    },
    refresh(): void {
      this.svg.remove();
      this.render(this.nodes, this.edges);
    }
  }
});
</script>
