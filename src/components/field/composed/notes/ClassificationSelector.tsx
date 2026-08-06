import { Component } from "solid-js";
import { Select } from "../../../form/Select";

type ClassificationSelectorProps = {
  value: string;
  options: { id: string; label: string }[];
  onValueChange: (value: string) => void;
  disabled: boolean;
};

export const ClassificationSelector: Component<ClassificationSelectorProps> = (props) => {
  return (
    <div>
      <b>Classification:</b>{" "}
      <Select
        placeholder={"Select classification"}
        value={props.value}
        options={props.options}
        onValueChange={(e) => props.onValueChange(e.value)}
        disabled={props.disabled}
      />
    </div>
  );
};
