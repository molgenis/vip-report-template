import { Component, For, Show } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterProps } from "./Filter";
import { infoSelector, selector, selectorKey } from "../../utils/query";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Query, QueryClause } from "@molgenis/vip-report-api/src/Api";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export type CategoryLabels = {
  [key: string]: string;
};

export const FilterHpo: Component<
  FilterProps & {
    labels?: CategoryLabels;
  }
> = (props) => {
  const group: CheckboxGroup = {};
  const hpoSelector = selector(props.field);
  const csqMeta = props.field.parent;
  let gadoHcChecked = false;
  let gadoLcChecked = false;
  let hpoValues: (string | null)[] = [];

  let gadoMeta: FieldMetadata | null = null;
  csqMeta?.nested?.items.forEach((meta) => {
    if (meta.id === "GADO_PD") {
      gadoMeta = meta;
    }
  });

  if (props.query !== undefined) {
    (props.query.args as Query[]).forEach((childQuery) => {
      if (selectorKey((childQuery as QueryClause).selector) === selectorKey(infoSelector(props.field))) {
        (childQuery.args as string[]).forEach((key) => {
          group[key] = true;
          hpoValues.push(key);
        });
      } else if (
        gadoMeta &&
        selectorKey((childQuery as QueryClause).selector) === selectorKey(infoSelector(gadoMeta))
      ) {
        if ((childQuery.args as string) === "LC") {
          gadoLcChecked = true;
        }
        if ((childQuery.args as string) === "HC") {
          gadoHcChecked = true;
        }
      }
    });
  }

  const nullValue = "__null";

  let gadoLcQuery: Query;
  let gadoHcQuery: Query;
  if (gadoMeta !== null) {
    gadoLcQuery = {
      selector: selector(gadoMeta),
      operator: "any_has_any",
      args: ["LC"],
    };

    gadoHcQuery = {
      selector: selector(gadoMeta),
      operator: "any_has_any",
      args: ["HC"],
    };
  }
  const onChange = (event: CheckboxEvent) => {
    const queries: Query[] = [];
    group[event.value !== undefined ? event.value : nullValue] = event.checked;
    const values = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => (key !== nullValue ? key : null));
    if (values.length > 0) {
      if (gadoMeta !== null) {
        if (values.includes("gado_lc")) {
          queries.push(gadoLcQuery);
          gadoLcChecked = true;
        } else {
          gadoHcChecked = false;
        }
        if (values.includes("gado_hc")) {
          queries.push(gadoHcQuery);
          gadoHcChecked = true;
        } else {
          gadoHcChecked = false;
        }
      }
      hpoValues = values.filter((key) => key !== "gado_lc" && key !== "gado_hc");
      if (hpoValues.length > 0) {
        const hpoQuery: Query = {
          selector: hpoSelector,
          operator: "any_has_any",
          args: hpoValues,
        };
        queries.push(hpoQuery);
      } else if (gadoMeta !== null) {
        props.onClear({ key: selectorKey(hpoSelector) });
      }

      props.onChange({
        key: selectorKey(hpoSelector),
        query: {
          operator: "or",
          args: queries,
        },
      });
    } else {
      props.onClear({ key: selectorKey(hpoSelector) });
    }
  };
  return (
    <>
      <For each={props.field.categories}>
        {(category) => (
          <div class="control">
            <Checkbox
              value={category}
              label={props.labels ? props.labels[category] : category}
              checked={hpoValues && hpoValues.includes(category)}
              onChange={onChange}
            />
          </div>
        )}
      </For>
      <Show when={gadoMeta !== null}>
        <div class="control">
          <Checkbox
            value="gado_hc"
            label="GADO high"
            desc="Gene predicted to have a relation with phenotypes of the proband (phenotypes of other samples are ignored!) with high confidence (Z-Score above 5)."
            checked={gadoHcChecked}
            onChange={onChange}
          />
        </div>
        <div class="control">
          <Checkbox
            value="gado_lc"
            label="GADO low"
            desc="Gene predicted to have a relation with phenotypes of the proband (phenotypes of other samples are ignored!) with low confidence (Z-Score above 3 but below 5)."
            checked={gadoLcChecked}
            onChange={onChange}
          />
        </div>
      </Show>
    </>
  );
};
