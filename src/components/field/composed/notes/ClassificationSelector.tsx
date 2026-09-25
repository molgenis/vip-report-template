import { Component } from "solid-js";
import { Select } from "../../../form/Select";
import { ClassificationOption } from "../../../../types/NotesApi";

type ClassificationSelectorProps = {
  value: string;
  options: ClassificationOption[];
  onValueChange: (value: string) => void;
  disabled: boolean;
};

export const ClassificationSelector: Component<ClassificationSelectorProps> = (props) => {
  return (
    <>
      <div>
        <b>Your classification:</b>{" "}
        <Select
          placeholder={"Select classification"}
          value={props.value}
          options={props.options?.map((option) => ({ id: option.value, label: option.label })) ?? []}
          onValueChange={(e) => props.onValueChange(e.value)}
          disabled={props.disabled}
          small={false}
          fullwidth={false}
        />
      </div>
    </>
  );
};
