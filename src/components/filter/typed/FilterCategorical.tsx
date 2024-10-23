import { Component, createEffect, createSignal, For, JSX, Show } from "solid-js";
import { FilterWrapper } from "../FilterWrapper";
import {
  ConfigFilterField,
  FilterCategory,
  FilterCategoryId,
  FilterValueCategorical,
} from "../../../types/configFilter";
import { Checkbox, CheckboxEvent } from "../../form/Checkbox";
import { FilterProps } from "../Filter.tsx";

type FilterValueCategoricalMap = { [key: FilterCategoryId]: null };

export const FilterCategorical: Component<FilterProps<ConfigFilterField, FilterValueCategorical>> = (props) => {
  const [values, setValues] = createSignal<FilterValueCategoricalMap>({});

  const categories = (): FilterCategory[] => {
    const categories = Object.entries(props.config.field.categories!).map(([id, value]) => ({
      id,
      label: value.label,
    }));
    if (!props.config.field.required) {
      categories.push({
        id: "__null",
        label: props.config.field.nullValue?.label || "Unspecified",
      });
    }
    return categories;
  };

  const tooltipContentElement = (): JSX.Element | null => {
    const categoryValues = Object.values(props.config.field.categories!);
    const hasCategoryDescriptions = categoryValues.findIndex((category) => category.description !== undefined);
    if (hasCategoryDescriptions === -1) return null;

    // add categorical descriptions to tooltip if available
    return (
      <ul>
        <For each={categoryValues}>
          {(categoryValue) => (
            <li>
              {categoryValue.label}
              {categoryValue.description ? `: ${categoryValue.description}` : ""}
            </li>
          )}
        </For>
      </ul>
    );
  };

  createEffect(() => {
    if (props.value && props.value.length > 0) {
      const newValues: FilterValueCategoricalMap = props.value.reduce((acc, v) => ({ ...acc, [v]: null }), {});
      setValues(newValues);
    }
  });

  const allSelected = () => Object.keys(values()).length === categories().length;
  const noneSelected = () => Object.keys(values()).length === 0;

  // event handling
  const onChange = (event: CheckboxEvent) => {
    const newValues: FilterValueCategoricalMap = { ...values() };
    if (event.checked) newValues[event.value] = null;
    else delete newValues[event.value];
    onValuesChange(newValues);
  };

  const onSelectAll = () => {
    const newValues: FilterValueCategoricalMap = categories().reduce(
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
    <FilterWrapper config={props.config} tooltipContentElement={tooltipContentElement()}>
      <div class="field">
        <For each={categories()}>
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
        <Show when={categories().length > 6}>
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
    </FilterWrapper>
  );
};
