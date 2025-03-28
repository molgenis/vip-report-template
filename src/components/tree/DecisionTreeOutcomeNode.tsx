import { Component } from "solid-js";
import { NodeOutcome } from "@molgenis/vip-report-api";

export const DecisionTreeOutcomeNode: Component<{ node: NodeOutcome }> = (props) => {
  return (
    <>
      <span>{props.node.nextNode}</span>
      {props.node.label && <span class="ml-1">(${props.node.label})</span>}
    </>
  );
};
