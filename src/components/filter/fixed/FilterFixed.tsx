import { Component, Match, Switch } from "solid-js";
import {
  ConfigFilterAlt,
  ConfigFilterChrom,
  ConfigFilterFilter,
  ConfigFilterFixed,
  ConfigFilterId,
  ConfigFilterPos,
  ConfigFilterQual,
  ConfigFilterRef,
  FilterValue,
  FilterValueAlt,
  FilterValueChrom,
  FilterValueFilter,
  FilterValueId,
  FilterValuePos,
  FilterValueQual,
  FilterValueRef,
} from "../../../types/configFilter";
import { ErrorNotification } from "../../ErrorNotification";
import { FilterProps } from "../Filter.tsx";
import { FilterChrom } from "./FilterChrom.tsx";
import { FilterPos } from "./FilterPos.tsx";
import { FilterId } from "./FilterId.tsx";
import { FilterRef } from "./FilterRef.tsx";
import { FilterAlt } from "./FilterAlt.tsx";
import { FilterQual } from "./FilterQual.tsx";
import { FilterFilter } from "./FilterFilter.tsx";

/**
 * Filter for a fixed VCF field (CHROM, POS, ID, REF, ALT, QUAL, FILTER) other than INFO
 */
export const FilterFixed: Component<FilterProps<ConfigFilterFixed, FilterValue>> = (props) => {
  const id = () => props.config.id;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field id ${id()}`} />}>
      <Match when={id() === "fixed/chrom"}>
        <FilterChrom
          config={props.config as ConfigFilterChrom}
          value={props.value as FilterValueChrom}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/pos"}>
        <FilterPos
          config={props.config as ConfigFilterPos}
          value={props.value as FilterValuePos}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/id"}>
        <FilterId
          config={props.config as ConfigFilterId}
          value={props.value as FilterValueId}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/ref"}>
        <FilterRef
          config={props.config as ConfigFilterRef}
          value={props.value as FilterValueRef}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/alt"}>
        <FilterAlt
          config={props.config as ConfigFilterAlt}
          value={props.value as FilterValueAlt}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/qual"}>
        <FilterQual
          config={props.config as ConfigFilterQual}
          value={props.value as FilterValueQual}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
      <Match when={id() === "fixed/filter"}>
        <FilterFilter
          config={props.config as ConfigFilterFilter}
          value={props.value as FilterValueFilter}
          defaultValue={props.defaultValue}
          onValueChange={props.onValueChange}
          onValueClear={props.onValueClear}
        />
      </Match>
    </Switch>
  );
};
