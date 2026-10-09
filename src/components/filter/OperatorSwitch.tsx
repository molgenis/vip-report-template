import { Component } from "solid-js";

export type FilterOperator = "and" | "or";

type OperatorSwitchProps = {
  value: FilterOperator;
  onChange: (operator: FilterOperator) => void;
  disabled?: boolean;
};

export const OperatorSwitch: Component<OperatorSwitchProps> = (props) => {
  return (
    <div class="buttons has-addons are-small mb-2">
      <button
        type="button"
        class="button"
        classList={{ "is-selected is-link": props.value === "or" }}
        disabled={props.disabled}
        onClick={() => props.onChange("or")}
      >
        Match Any
      </button>
      <button
        type="button"
        class="button"
        classList={{ "is-selected is-link": props.value === "and" }}
        disabled={props.disabled}
        onClick={() => props.onChange("and")}
      >
        Match All
      </button>
    </div>
  );
};
