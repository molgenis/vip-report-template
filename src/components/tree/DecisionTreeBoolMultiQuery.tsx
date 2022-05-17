import { Component, For } from "solid-js";
import { BoolMultiQuery } from "@molgenis/vip-report-api/src/DecisionTree";
import { DecisionTreeBoolQuery } from "./DecisionTreeBoolQuery";
import { DecisionTreeOutcomeNode } from "./DecisionTreeOutcomeNode";

export const DecisionTreeBoolMultiQuery: Component<{ query: BoolMultiQuery }> = (props) => {
  return (
    <>
      <For each={props.query.queries}>
        {(query, i) => (
          <>
            {i() !== 0 && <span class="ml-1 mr-1">{props.query.operator}</span>}
            <DecisionTreeBoolQuery query={query} />
          </>
        )}
      </For>
      <span class="ml-1 mr-1">{"\u2192"}</span>
      <DecisionTreeOutcomeNode node={props.query.outcomeTrue} />
    </>
  );
};
