import { Component, createMemo } from "solid-js";
import { BoolQuery } from "@molgenis/vip-report-api";
import { Abbr } from "../Abbr";

export const DecisionTreeBoolQuery: Component<{ query: BoolQuery }> = (props) => {
  const value = createMemo(() => props.query.field + " " + props.query.operator + " " + String(props.query.value));

  function label(value: string) {
    let label = undefined;
    if (value.length > 100) {
      label = value.slice(0, 100);
    }
    return label;
  }

  return (
    <>
      {label(value()) !== undefined && <Abbr title={value()} value={label(value()) as string} />}
      {label(value()) === undefined && <span>{value()}</span>}
    </>
  );
};
