import { Component } from "solid-js";
import { LeafNode } from "@molgenis/vip-report-api/src/Api";

export const DecisionTreeNodeLeaf: Component<{ node: LeafNode }> = (props) => {
  return <span>classification: {props.node.class}</span>;
};
