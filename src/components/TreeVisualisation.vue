<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';

import { select, event } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import render from 'dagre-d3/lib/render';
import { Graph } from 'graphlib';
import { retrieveNodes, retrieveEdges } from '@/utils/treeBuilder';
import { calculateWidthScale, calculateHeightScale } from '@/utils/scaleCalculator';
import { TreeNodes } from '@/types/TreeNodes';
import { DecisionTree } from '@/types/DecisionTree';
import { TreeEdgesArray } from '@/types/TreeEdges';
import { StyledNode, TreeGraph } from '@/types/dagre';
import { D3SVGSelection, D3GSelection } from '@/types/d3';

export default Vue.extend({
  name: 'TreeVisualisation',
  props: {
    tree: String
  },
  mounted(): void {
    this.render(this.nodes, this.edges);
  },
  data(): { svg: D3SVGSelection; initialScale: number } {
    return {
      svg: {},
      initialScale: 0.65
    };
  },
  computed: {
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
    drawNodes(nodes: TreeNodes, g: TreeGraph): void {
      nodes.forEach((node) => {
        g.setNode(node.id, { label: node.label });
        const nodeToStyle: StyledNode = g.node(node.id);
        nodeToStyle.style = node.id.indexOf('error') === -1 ? 'fill: #7f7' : 'fill: #f77';
      });
      g.nodes().forEach((gNode: string | { [key: string]: any }) => {
        const node = g.node(gNode);
        node.rx = node.ry = 5;
      });
    },
    drawEdges(edges: TreeEdgesArray, g: TreeGraph): void {
      edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to, { label: edge.label });
      });
    },
    addToolTips(inner: D3GSelection): void {
      const self = this;
      inner.selectAll('g.node').attr('title', () => 'tree');
    },
    addZoom(g: TreeGraph): void {
      const inner = this.svg.append('g');
      const d3zoom = zoom().on('zoom', () => {
        inner.attr('transform', event.transform);
      });
      this.svg.call(d3zoom);
      const renderTree = new render();
      renderTree(inner, g);
      this.addToolTips(inner);
      const width = parseInt(this.svg.attr('width'));
      const graphWidth = g.graph().width;
      if (graphWidth) {
        this.svg.call(
          d3zoom.transform,
          zoomIdentity.translate(calculateWidthScale(width, graphWidth, this.initialScale), 20).scale(this.initialScale)
        );
      }
      const graphHeight = g.graph().height;
      if (graphHeight) {
        this.svg.attr('height', calculateHeightScale(graphHeight, this.initialScale));
      }
    },
    setSvg(g: TreeGraph): void {
      this.svg = select(this.$el)
        .append('svg')
        .attr('width', document.body.clientWidth - 350)
        .attr('height', 250);
      this.addZoom(g);
    },
    render(nodes: TreeNodes, edges: TreeEdgesArray): void {
      const g: TreeGraph = new Graph().setGraph({});
      this.drawNodes(nodes, g);
      this.drawEdges(edges, g);
      this.setSvg(g);
    },
    refresh(): void {
      this.svg.remove();
      this.render(this.nodes, this.edges);
    }
  }
});
</script>

<style>
h1,
svg {
  text-align: center;
}

svg {
  display: block;
  margin: auto;
  border: 1px solid #ccc;
}

.node rect {
  stroke: #333;
  fill: #fff;
}

.edgePath path {
  stroke: #333;
  fill: #333;
  stroke-width: 1.5px;
}
</style>
