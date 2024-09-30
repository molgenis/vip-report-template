import { Component, createEffect, createSignal } from "solid-js";
import { Filter, FilterTypedProps } from "./Filter";
import { Input } from "../Input";
import { ButtonApply } from "./ButtonApply";
import { ButtonReset } from "./ButtonReset";

import { FilterValueInterval } from "../../types/filter";

export type FilterIntervalProps = FilterTypedProps<FilterValueInterval>;

export const FilterInterval: Component<FilterIntervalProps> = (props) => {
  const [leftInputValue, setLeftInputValue] = createSignal<string>("");
  const [rightInputValue, setRightInputValue] = createSignal<string>("");

  createEffect(() => {
    if (props.value) {
      if (props.value.left !== undefined) {
        setLeftInputValue(props.value.left.toString());
      }
      if (props.value.right !== undefined) {
        setRightInputValue(props.value.right.toString());
      }
    }
  });

  const onApply = () => {
    if (leftInputValue().length === 0 && rightInputValue().length === 0) {
      props.onValueClear();
    } else {
      props.onValueChange({
        value: {
          left: leftInputValue().length > 0 ? parseInt(leftInputValue()) : undefined,
          right: rightInputValue().length > 0 ? parseInt(rightInputValue()) : undefined,
        },
      });
    }
  };

  const onReset = () => {
    setLeftInputValue("");
    setRightInputValue("");
    props.onValueClear();
  };

  return (
    <Filter {...props}>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <Input placeholder="From" value={leftInputValue()} onValueChange={(e) => setLeftInputValue(e.value)} />
        </div>
        <div class="control is-expanded">
          <Input placeholder="To" value={rightInputValue()} onValueChange={(e) => setRightInputValue(e.value)} />
        </div>
        <div class="control">
          <ButtonApply onClick={onApply} />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <ButtonReset onClick={() => onReset()} />
        </div>
      </div>
    </Filter>
  );
};
