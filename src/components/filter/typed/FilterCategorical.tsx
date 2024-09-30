import { Component, createEffect, createSignal, For, Show } from "solid-js";
import { FilterTypedProps, FilterWrapper } from "../FilterWrapper";
import { FilterCategory, FilterCategoryId, FilterValueCategorical } from "../../../types/configFilter";
import { Checkbox, CheckboxEvent } from "../../form/Checkbox";
import { CategoryRecord, ValueDescription } from "../../../../../vip-report-vcf/src/types/Metadata";

type FilterValueCategoricalMap = { [key: FilterCategoryId]: null };

export interface FilterCategoricalProps extends FilterTypedProps<FilterValueCategorical> {
  categories: CategoryRecord;
  nullCategory: ValueDescription | null | undefined;
}

export const FilterCategorical: Component<FilterCategoricalProps> = (props) => {
  const [values, setValues] = createSignal<FilterValueCategoricalMap>({});

  const categories = (): FilterCategory[] => {
    const categories = Object.entries(props.categories).map(([id, value]) => ({
      id,
      label: value.label,
    }));
    if (props.nullCategory !== undefined) {
      categories.push({
        id: "__null",
        label: props.nullCategory !== null ? props.nullCategory.label : "Unspecified",
      });
    }
    return categories;
  };

  const tooltip = () => {
    const categoryValues = Object.values(props.categories);
    const hasCategoryDescriptions = categoryValues.findIndex((category) => category.description !== undefined);
    if (hasCategoryDescriptions === -1) return props.tooltip;

    // add categorical descriptions to tooltip if available
    return (
      <>
        {props.tooltip}
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
      </>
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
    <FilterWrapper {...props} tooltip={tooltip()}>
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
