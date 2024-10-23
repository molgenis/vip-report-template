import { Component, createEffect, createSignal } from "solid-js";
import { FilterWrapper } from "../FilterWrapper";
import { ConfigFilterField, FilterValueString } from "../../../types/configFilter";
import { Input } from "../../form/Input";
import { ButtonApply } from "../../form/ButtonApply";
import { FilterProps } from "../Filter.tsx";

export const FilterString: Component<FilterProps<ConfigFilterField, FilterValueString>> = (props) => {
  const [inputValue, setInputValue] = createSignal<string>("");

  createEffect(() => {
    if (props.value) {
      setInputValue(props.value.join(","));
    }
  });

  const onApply = () => {
    const value = inputValue();
    if (value.length > 0) {
      props.onValueChange({ value: value.split(",") });
    } else {
      props.onValueClear();
    }
  };

  return (
    <FilterWrapper config={props.config}>
      <div class="field is-grouped">
        <div class="control is-expanded has-icons-right">
          <Input value={inputValue()} onValueChange={(event) => setInputValue(event.value)} />
          {inputValue().length > 0 && (
            <span class="icon is-clickable is-right" onClick={() => setInputValue("")}>
              <i class="fas fa-circle-xmark" />
            </span>
          )}
        </div>
        <div class="control">
          <ButtonApply onClick={onApply} />
        </div>
      </div>
    </FilterWrapper>
  );
};
