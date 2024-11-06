import { Component } from "solid-js";
import { BoolNode } from "@molgenis/vip-report-api";
import { DecisionTreeOutcomeNode } from "./DecisionTreeOutcomeNode";
import { DecisionTreeBoolQuery } from "./DecisionTreeBoolQuery";

export const DecisionTreeNodeBool: Component<{ node: BoolNode }> = (props) => {
  return (
    <>
      <p>
        Query: <DecisionTreeBoolQuery query={props.node.query} />
      </p>
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
      {props.node.outcomeMissing && (
        <p class="ml-3">
          <span>Missing</span>
          <span class="ml-1 mr-1">{"\u2192"}</span>
          <DecisionTreeOutcomeNode node={props.node.outcomeMissing} />
        </p>
      )}
    </>
  );
};
