import { Component, createEffect, createSignal, For, onMount, Show } from "solid-js";
import { FilterWrapper } from "../filter/FilterWrapper";
import {
  ConfigFilterField,
  FilterCategory,
  FilterCategoryId,
} from "../../types/configFilter";
import { Checkbox, CheckboxEvent } from "../form/Checkbox";
import { FilterProps } from "../filter/Filter.tsx";
import { FilterValueClassification } from "../../types/configFilterComposed";

type FilterValueCategoricalMap = { [key: FilterCategoryId]: null };

export const FilterClassification: Component<FilterProps<ConfigFilterField, FilterValueClassification>> = (props) => {
  const [values, setValues] = createSignal<FilterValueCategoricalMap>({});

  const categories = (): FilterCategory[] => {
    const categories = [];
    categories.push({
      id: "-",
      label: "-",
    });
    categories.push({
      id: "B",
      label: "B",
    });
    categories.push({
      id: "LB",
      label: "LB",
    });
    categories.push({
      id: "VUS",
      label: "VUS",
    });
    categories.push({
      id: "LP",
      label: "LP",
    });
    categories.push({
      id: "P",
      label: "P",
    });

    return categories;
  };

  createEffect(() => {
    if (props.value && props.value.values && props.value.values.length > 0) {
      const newValues: FilterValueCategoricalMap = props.value.values.reduce((acc, v) => ({ ...acc, [v]: null }), {});
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

  const onValuesChange = async (values: FilterValueCategoricalMap) => {
    setValues(values);

    const rows = async () => {
      const res = await fetch("/RD3/graphql", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query: `
            {
              VIPInfo(filter: { classification: { match_any: ["${Object.keys(values).join('","')}"] }, reportId: { equals: "${props.reportId}" } }) {
                vipId
              }
            }
          `,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      return data?.data?.VIPInfo ?? [];
    }
    if (Object.keys(values).length > 0) {
      const result = await rows();
      const numbers = result.map((item: { vipId: string }) => parseInt(item.vipId, 10));

      props.onValueChange({ value: { values: Object.keys(values), ids: numbers, report: props.reportId } });
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
    if (props.config.defaultValue !== undefined && !props.isInited) {
      let values;
      if (props.config.defaultValue === "non_null") {
        values = categories()
          .map((cat) => cat.id)
          .filter((id) => id !== "__null");
      } else {
        values = props.config.defaultValue.split(",");
        validateValues(values, categories());
      }
      props.onValueChange({ value: {ids: [], values: values, report: props.reportId }});
    }
  });

  return (
    <FilterWrapper
      config={{
        type: "composed",
        id: "classification",
        label: () => "RD3 Classification",
        description: () => "RD3 Classification",
      }}
    >
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
