import { Component, Show, createMemo } from "solid-js";
import { Select } from "../../../form/Select";
import { ClassificationOption } from "../../../../types/NotesApi";

type ClassificationSelectorProps = {
  value: string;
  options: ClassificationOption[];
  onValueChange: (value: string) => void;
  disabled: boolean;
};

export const ClassificationSelector: Component<ClassificationSelectorProps> = (props) => {
  const selectOptions = createMemo(
    () => props.options?.map((option) => ({ id: option.value, label: option.label })) ?? [],
  );
  const selectKey = () => `${selectOptions().length}|${props.value}`;

  return (
    <div>
      <b>Your classification:</b>{" "}
      <Show when={selectOptions().length > 0} fallback={<span>Loading...</span>}>
        <Show when={selectKey()} keyed>
          <Select
            placeholder={"Select classification"}
            value={props.value}
            options={selectOptions()}
            onValueChange={(e) => props.onValueChange(e.value)}
            disabled={props.disabled}
            small={false}
            fullwidth={false}
          />
        </Show>
      </Show>
    </div>
  );
};
