import { Component } from "solid-js";
import { ExistsNode } from "@molgenis/vip-report-api/src/Api";
import { DecisionTreeOutcomeNode } from "./DecisionTreeOutcomeNode";

export const DecisionTreeNodeExists: Component<{ node: ExistsNode }> = (props) => {
  return (
    <>
      <p>exists: {props.node.field}</p>
      {props.node.outcomeTrue && (
        <p class="ml-3">
          <span>True</span>
          <span class="ml-1 mr-1">{"\u2192"}</span>
          <DecisionTreeOutcomeNode node={props.node.outcomeTrue} />
        </p>
      )}
      {props.node.outcomeFalse && (
        <p class="ml-3">
          <span>False</span>
          <span class="ml-1 mr-1">{"\u2192"}</span>
          <DecisionTreeOutcomeNode node={props.node.outcomeFalse} />
        </p>
      )}
    </>
  );
};
