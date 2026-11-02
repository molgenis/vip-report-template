import { Component, createEffect, createSignal, For, JSX, onMount, Show, untrack } from "solid-js";
import { FilterWrapper } from "../FilterWrapper";
import {
  ConfigFilterField,
  FilterCategory,
  FilterCategoryId,
  FilterValueCategorical,
} from "../../../types/configFilter";
import { Checkbox, CheckboxEvent } from "../../form/Checkbox";
import { FilterProps } from "../Filter.tsx";
import { FilterOperator, OperatorSwitch } from "../OperatorSwitch";

type FilterValueCategoricalMap = { [key: FilterCategoryId]: null };

export const FilterCategorical: Component<FilterProps<ConfigFilterField, FilterValueCategorical>> = (props) => {
  const [values, setValues] = createSignal<FilterValueCategoricalMap>({});

  // Initial value only: later prop changes are synced by the createEffect below.
  // Priority: saved value > prop default > config default > "or".
  const [operator, setOperator] = createSignal<FilterOperator>(
    untrack(
      () =>
        (props.value?.operator as FilterOperator | undefined) ??
        props.defaultComposedOperator ??
        props.config.defaultComposedOperator ??
        "or",
    ),
  );

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

  // sync local state with incoming props
  createEffect(() => {
    if (props.value?.operator) {
      setOperator(props.value.operator as FilterOperator);
    }
    if (props.value && props.value.categories.length > 0) {
      const newValues: FilterValueCategoricalMap = props.value.categories.reduce(
        (acc, v) => ({ ...acc, [v]: null }),
        {},
      );
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

  const onOperatorChange = (newOperator: FilterOperator) => {
    setOperator(newOperator);

    // only emit a value change if there is an active selection
    if (Object.keys(values()).length > 0) {
      props.onValueChange({
        value: { categories: Object.keys(values()), operator: newOperator } as FilterValueCategorical,
      });
    }
  };

  const onValuesChange = (values: FilterValueCategoricalMap) => {
    setValues(values);

    if (Object.keys(values).length > 0) {
      props.onValueChange({
        value: { categories: Object.keys(values), operator: operator() } as FilterValueCategorical,
      });
    } else {
      props.onValueClear();
    }
  };

  function validateValues(values: string[], filterCategories: FilterCategory[]) {
    const invalidValues = values.filter((v) => !filterCategories.map((fc) => fc.id).includes(v));
    if (invalidValues.length > 0) {
      throw new Error(
        `Invalid default values ('${invalidValues.join(", ")}') found for filter '${props.config.field.id}'.`,
      );
    }
  }

  onMount(() => {
    if (props.isInited) return;

    if (props.config.defaultValue !== undefined) {
      let values: string[];
      if (props.config.defaultValue === "non_null") {
        values = categories()
          .map((cat) => cat.id)
          .filter((id) => id !== "__null");
      } else {
        values = props.config.defaultValue.split(",");
        validateValues(values, categories());
      }
      props.onValueChange({
        value: { categories: values, operator: operator() } as FilterValueCategorical,
      });
    }
  });

  return (
    <FilterWrapper config={props.config} tooltipContentElement={tooltipContentElement()}>
      <div class="field">
        <Show when={props.config.showComposedOperator === true}>
          <div class="control mb-2">
            <OperatorSwitch value={operator()} onChange={onOperatorChange} />
          </div>
        </Show>
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
