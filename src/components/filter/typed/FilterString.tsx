import { Component, createEffect, createSignal } from "solid-js";
import { FilterTypedProps, FilterWrapper } from "../FilterWrapper";
import { FilterValueString } from "../../../types/configFilter";
import { Input } from "../../form/Input";
import { ButtonApply } from "../../form/ButtonApply";

export interface FilterStringProps extends FilterTypedProps<FilterValueString> {
  placeholder?: string | undefined;
}

export const FilterString: Component<FilterStringProps> = (props) => {
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
    <FilterWrapper {...props}>
      <div class="field is-grouped">
        <div class="control is-expanded has-icons-right">
          <Input
            placeholder={props.placeholder}
            value={inputValue()}
            onValueChange={(event) => setInputValue(event.value)}
          />
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
