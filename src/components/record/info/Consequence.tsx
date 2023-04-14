import { Component } from "solid-js";
import { FieldProps } from "../field/Field";
import { Abbr } from "../../Abbr";

export const Consequence: Component<FieldProps> = (props) => {
  const consequence = (): string[] => props.info.value as string[];

  return (
    <>
      <span>{consequence()[0]}</span>
      {consequence().length > 1 && (
        <span>
          , <Abbr title={consequence().slice(1).join(", ")} value={"\u2026"} />
        </span>
      )}
    </>
  );
};
