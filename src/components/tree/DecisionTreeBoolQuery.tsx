import { Component } from "solid-js";
import { BoolQuery } from "@molgenis/vip-report-api/src/DecisionTree";

export const DecisionTreeBoolQuery: Component<{ query: BoolQuery }> = (props) => {
  const value = props.query.field + " " + props.query.operator + " " + String(props.query.value);

  function label(value: string) {
    let label = undefined;
    if (value.length > 100) {
      label = value.slice(0, 100);
    }
    return label;
  }

  return (
    <>
      {label(value) !== undefined && <abbr title={value}>{label(value)}</abbr>}
      {label(value) === undefined && <span>{value}</span>}
    </>
  );
};
