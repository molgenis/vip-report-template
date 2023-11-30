import { Component } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterProps } from "./Filter";
import { infoSelector, selectorKey } from "../../utils/query";
import { ComposedQuery, Query, QueryClause } from "@molgenis/vip-report-api/src/Api";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export type CategoryLabels = {
  [key: string]: string;
};

export const FilterVariantType: Component<
  FilterProps & {
    labels?: CategoryLabels;
  }
> = (props) => {
  const group: CheckboxGroup = {};
  let snvChecked = false;
  let strChecked = false;
  let svChecked = false;
  const svSelector = infoSelector(props.field);
  const strQuery: QueryClause = {
    selector: svSelector,
    operator: "==",
    args: "STR",
  };

  const svQuery: ComposedQuery = {
    operator: "and",
    args: [
      {
        selector: svSelector,
        operator: "!=",
        args: "STR",
      },
      {
        selector: svSelector,
        operator: "!=",
        args: null,
      },
      {
        selector: svSelector,
        operator: "!=",
        args: undefined,
      },
    ],
  };

  const snvQuery: ComposedQuery = {
    operator: "or",
    args: [
      {
        selector: svSelector,
        operator: "==",
        args: null,
      },
      {
        selector: svSelector,
        operator: "==",
        args: undefined,
      },
    ],
  };

  if (props.query !== undefined && props.query.args.length > 0) {
    const query: Query = props.query.args[0] as Query;
    (query.args as Query[]).forEach((childQuery) => {
      if (childQuery.operator == "and") {
        group["SNV"] = true;
        snvChecked = true;
      }
      if (childQuery.operator == "or") {
        group["SV"] = true;
        svChecked = true;
      }
      if (childQuery.operator == "==") {
        group["STR"] = true;
        strChecked = true;
      }
    });
  }
  const onChange = (event: CheckboxEvent) => {
    const queries: Query[] = [];
    group[event.value] = event.checked;
    const values = Object.keys(group).filter((key) => group[key]);
    if (values.length > 0) {
      if (values.includes("SNV")) {
        queries.push(snvQuery);
        snvChecked = true;
      } else {
        snvChecked = false;
      }
      if (values.includes("STR")) {
        queries.push(strQuery);
        strChecked = true;
      } else {
        strChecked = false;
      }
      if (values.includes("SV")) {
        queries.push(svQuery);
        svChecked = true;
      } else {
        svChecked = false;
      }
      props.onChange({
        key: selectorKey(svSelector),
        query: {
          operator: "or",
          args: queries,
        },
      });
    } else {
      props.onClear({ key: selectorKey(svSelector) });
    }
  };

  return (
    <>
      <p class="has-text-weight-semibold">
        <abbr title={"Only show variants of a certain type (called by a specific variant caller)."}>
          {"Variant type"}
        </abbr>
      </p>

      <div class="field">
        <div class="control">
          <Checkbox
            value="SNV"
            label="SNV/Indel"
            desc="Single nucleotide variants and short InDels."
            checked={snvChecked}
            onChange={onChange}
          />
        </div>
        <div class="control">
          <Checkbox value="SV" label="SV" desc="Structural variants." checked={svChecked} onChange={onChange} />
        </div>
        <div class="control">
          <Checkbox value="STR" label="STR" desc="Short Tandem Repeats." checked={strChecked} onChange={onChange} />
        </div>
      </div>
    </>
  );
};
