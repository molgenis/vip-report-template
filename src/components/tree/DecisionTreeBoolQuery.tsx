import { Component } from "solid-js";
import { BoolQuery } from "../../api/DecisionTree";

export const DecisionTreeBoolQuery: Component<{ query: BoolQuery }> = (props) => {
  return (
    <span>
      {props.query.field} {props.query.operator} {String(props.query.value)}
    </span>
  );
};
