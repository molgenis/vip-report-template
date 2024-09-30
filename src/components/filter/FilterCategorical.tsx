import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { Filter, FilterTypedProps } from "./Filter";
import { Checkbox, CheckboxEvent } from "./Checkbox";
import { FilterCategory, FilterCategoryId, FilterValueCategorical } from "../../types/filter";

type FilterValueCategoricalMap = { [key: FilterCategoryId]: null };

export interface FilterCategoricalProps extends FilterTypedProps<FilterValueCategorical> {
  categories: FilterCategory[];
}

export const FilterCategorical: Component<FilterCategoricalProps> = (props) => {
  const [values, setValues] = createSignal<FilterValueCategoricalMap>({});

  createEffect(() => {
    if (props.value && props.value.length > 0) {
      const newValues: FilterValueCategoricalMap = props.value.reduce((acc, v) => ({ ...acc, [v]: null }), {});
      setValues(newValues);
    }
  });

  const allSelected = () => Object.keys(values()).length === props.categories.length;
  const noneSelected = () => Object.keys(values()).length === 0;

  // event handling
  const onChange = (event: CheckboxEvent) => {
    const newValues: FilterValueCategoricalMap = { ...values() };
    if (event.checked) newValues[event.value] = null;
    else delete newValues[event.value];
    onValuesChange(newValues);
  };

  const onSelectAll = () => {
    const newValues: FilterValueCategoricalMap = props.categories.reduce(
      (acc, category) => ({ ...acc, [category.id]: null }),
      {},
    );
    onValuesChange(newValues);
  };

  const onDeselectAll = () => {
    onValuesChange({});
  };

  const onValuesChange = (values: FilterValueCategoricalMap) => {
    setValues(values);

    if (Object.keys(values).length > 0) {
      props.onValueChange({ value: Object.keys(values) as FilterValueCategorical });
    } else {
      props.onValueClear();
    }
  };

  return (
    <Filter {...props}>
      <div class="field">
        <For each={props.categories}>
          {(category) => (
            <div class="control">
              <Checkbox value={category.id} checked={values()[category.id] === null} onChange={onChange}>
                <span>{category.label}</span>
                <Show when={category.count !== undefined}>
                  <span class="is-family-monospace is-pulled-right">({category.count})</span>
                </Show>
              </Checkbox>
            </div>
          )}
        </For>
        <Show when={props.categories.length > 6}>
          <div class="buttons are-small">
            <button class="button is-ghost" disabled={allSelected()} onClick={onSelectAll}>
              Select all
            </button>
            <button class="button is-ghost" disabled={noneSelected()} onClick={onDeselectAll}>
              Deselect all
            </button>
          </div>
        </Show>
      </div>
    </Filter>
  );
};
