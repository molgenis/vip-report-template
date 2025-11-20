import { Component, createEffect, createSignal, onMount } from "solid-js";
import { FilterWrapper } from "../FilterWrapper";
import { ConfigFilterField, FilterValueInterval } from "../../../types/configFilter";
import { Input } from "../../form/Input";
import { ButtonApply } from "../../form/ButtonApply";
import { ButtonReset } from "../../form/ButtonReset";
import { FilterProps } from "../Filter.tsx";

import { validateIntervalInput } from "../../../utils/utils.ts";

export const FilterInterval: Component<FilterProps<ConfigFilterField, FilterValueInterval>> = (props) => {
  const [leftInputValue, setLeftInputValue] = createSignal<string>("");
  const [rightInputValue, setRightInputValue] = createSignal<string>("");
  const [error, setError] = createSignal<string>();

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

  onMount(() => {
    if (props.config.defaultValue !== undefined) {
      const split = props.config.defaultValue.split(",");
      if (split.length >= 1) {
        if (split[0] !== undefined && split[0] !== "") {
          if (Number.isNaN(Number(split[0]))) {
            throw new TypeError(
              `'${props.config.defaultValue}' is not a valid default value for field '${props.config.field.id}'.`,
            );
          }
          setLeftInputValue(split[0]);
        }
      }
      if (split.length === 2) {
        if (split[1] !== undefined && split[1] !== "") {
          if (Number.isNaN(Number(split[1]))) {
            throw new TypeError(
              `'${props.config.defaultValue}' is not a valid default value for field '${props.config.field.id}'.`,
            );
          }
          console.log("7");
          setRightInputValue(split[1]);
        }
        onApply();
      }
    }
  });

  const onApply = () => {
    const validationResult = validateIntervalInput(props.config.id, leftInputValue(), rightInputValue());
    if (validationResult !== undefined) {
      setError(validationResult);
    } else {
      setError(undefined);
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
    }
  };

  const onReset = () => {
    setLeftInputValue("");
    setRightInputValue("");
    props.onValueClear();
  };

  return (
    <FilterWrapper config={props.config} error={error()}>
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
