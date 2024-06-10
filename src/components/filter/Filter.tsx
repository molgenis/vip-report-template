import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterCategorical } from "./FilterCategorical";
import { FilterIntegerGq } from "./FilterIntegerGq";
import { Item, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { FilterClinVar } from "./FilterClinVar";
import { isAnyCsqInfo } from "../../utils/csqUtils";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { FilterAllelicBalance } from "./FilterAllelicBalance";
import { FilterHpo } from "./FilterHpo";
import { FilterGene } from "./FilterGene";
import { FilterVI } from "./FilterVI";
import { FilterVariantType } from "./FilterVariantType";

export type FilterProps = {
  field: FieldMetadata;
  query?: Query;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  sample?: Item<Sample>;
};

export const Filter: Component<FilterProps> = (props) => {
  return (
    <>
      <Switch>
        <Match when={props.field.id === "GQ"}>
          <FilterIntegerGq {...props} />
        </Match>
        <Match when={props.field.id === "VIAB"}>
          <FilterAllelicBalance {...props} />
        </Match>
        <Match when={props.field.id === "VI"}>
          <FilterVI {...props} />
        </Match>
        <Match when={props.field.id === "SVTYPE"}>
          <FilterVariantType {...props} />
        </Match>
        <Match when={isAnyCsqInfo(props.field, ["clinVar_CLNSIG", "clinVar_CLNSIGINCL"])}>
          <FilterClinVar {...props} />
        </Match>
        <Match when={props.field.id === "HPO"}>
          <FilterHpo {...props} />
        </Match>
        <Match when={props.field.id === "IncompletePenetrance"}>
          <FilterGene {...props} />
        </Match>
        <Match when={props.field.type === "CATEGORICAL"}>
          <FilterCategorical {...props} />
        </Match>
      </Switch>
    </>
  );
};
