import { Component } from "solid-js";
import { Abbr } from "../../Abbr";

export const FieldConsequence: Component<{ value: string[] }> = (props) => {
  return (
    <>
      <span>{props.value[0]}</span>
      {props.value.length > 1 && (
        <span>
          , <Abbr title={props.value.slice(1).join(", ")} value={"\u2026"} />
        </span>
      )}
    </>
  );
};
