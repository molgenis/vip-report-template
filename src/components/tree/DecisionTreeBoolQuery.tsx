import { Component } from "solid-js";
import { BoolQuery } from "@molgenis/vip-report-api/src/DecisionTree";

export const DecisionTreeBoolQuery: Component<{ query: BoolQuery }> = (props) => {
  return (
    <span>
      {props.query.field} {props.query.operator} {String(props.query.value)}
    </span>
  );
};
