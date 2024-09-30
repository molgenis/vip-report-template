import { Component, createEffect, createSignal } from "solid-js";
import { FilterTypedProps, FilterWrapper } from "../FilterWrapper";
import { FilterValueInterval } from "../../../types/configFilter";
import { Input } from "../../form/Input";
import { ButtonApply } from "../../form/ButtonApply";
import { ButtonReset } from "../../form/ButtonReset";

export const FilterInterval: Component<FilterTypedProps<FilterValueInterval>> = (props) => {
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
    <FilterWrapper {...props}>
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
    </FilterWrapper>
  );
};
