<template>
  <div class="d3-tree-visualisation">
    <b-button-group vertical class="float-right">
      <b-button class="btn-xs" v-b-tooltip.click :title="$t('treeInfo')">
        <b-icon-info-circle />
      </b-button>
      <b-button class="btn-xs">
        <b-icon-arrow-repeat @click="flipGraph" />
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
  data(): {
    graphWidth: number;
    graphHeight: number;
    graphZoom: ZoomBehavior<SVGSVGElement, never> | undefined;
    fitOnScreen: boolean;
    horizontal: boolean;
    svg: Selection<SVGSVGElement, never, null, undefined> | undefined;
    clientWidth: number;
    clientHeight: number;
  } {
    return {
      graphWidth: 0,
      graphHeight: 0,
      graphZoom: undefined,
      fitOnScreen: false,
      horizontal: false,
      svg: undefined,
      clientWidth: 0,
      clientHeight: 0
    };
  },
  created(): void {
    window.addEventListener('resize', this.refresh);
  },
  destroyed(): void {
    window.removeEventListener('resize', this.refresh);
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
    },
    horizontal(): void {
      this.refresh();
    }
  },
  methods: {
    flipGraph() {
      this.horizontal = !this.horizontal;
      this.refresh();
    },
    zoomToFit() {
      const height = this.svgHeight / (this.graphHeight + 50);
      const width = this.svgWidth / (this.graphWidth + 150);
      const scale = Math.min(height, width);
      if (this.graphZoom && this.svg) {
        this.graphZoom.scaleBy(this.svg.transition().duration(750), scale, [width / 2, 0]);
        this.fitOnScreen = true;
      }
    },
    resetZoom() {
      if (this.graphZoom && this.svg) {
        this.svg.transition().duration(750).call(this.graphZoom.transform, zoomIdentity);
        this.fitOnScreen = false;
      }
    },
    setSvg() {
      this.svg = defineCanvas(d3Select(this.$el), this.svgWidth, this.svgHeight);
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
      if (this.svg) {
        drawNodes(this.svg, g, this.fontSize, this.graphWidth, this.graphHeight, this.horizontal);
        drawEdges(this.svg, g, this.barHeight, this.font, this.graphWidth, this.graphHeight, this.horizontal);
        this.graphZoom = defineZoom(this.svg, 0.2, 8);
        this.svg.call(this.graphZoom);
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
