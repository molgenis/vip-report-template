import { Component, Match, Switch } from "solid-js";
import {
  CellValue,
  CellValueAlt,
  CellValueChrom,
  CellValueFilter,
  CellValueFormat,
  CellValueGenotype,
  CellValueId,
  CellValueInfo,
  CellValuePos,
  CellValueQual,
  CellValueRef,
  ConfigCellCustom,
  ConfigCellGenotype,
  ConfigCellInfo,
  ConfigCellItem,
} from "../../types/configCells";
import { ErrorNotification } from "../ErrorNotification";
import { FieldComposed } from "./composed/FieldComposed";
import { CellValueCustom } from "../../types/configCellComposed";
import { FieldGenotype } from "./genotype/FieldGenotype";
import { FieldInfo } from "./info/FieldInfo";
import { FieldChrom } from "./FieldChrom";
import { FieldPos } from "./FieldPos";
import { FieldId } from "./FieldId";
import { FieldRef } from "./FieldRef";
import { FieldAlt } from "./FieldAlt";
import { FieldQual } from "./FieldQual";
import { FieldFilter } from "./FieldFilter";
import { FieldFormat } from "./FieldFormat";

export const Field: Component<{
  config: ConfigCellItem;
  value: CellValue;
}> = (props) => {
  const type = () => props.config.type;

  return (
    <Switch fallback={<ErrorNotification error={`unexpected field type ${type()}`} />}>
      <Match when={type() === "chrom"}>
        <FieldChrom value={props.value as CellValueChrom} />
      </Match>
      <Match when={type() === "pos"}>
        <FieldPos value={props.value as CellValuePos} />
      </Match>
      <Match when={type() === "id"}>
        <FieldId value={props.value as CellValueId} />
      </Match>
      <Match when={type() === "ref"}>
        <FieldRef value={props.value as CellValueRef} />
      </Match>
      <Match when={type() === "alt"}>
        <FieldAlt value={props.value as CellValueAlt} />
      </Match>
      <Match when={type() === "qual"}>
        <FieldQual value={props.value as CellValueQual} />
      </Match>
      <Match when={type() === "filter"}>
        <FieldFilter value={props.value as CellValueFilter} />
      </Match>
      <Match when={type() === "info"}>
        <FieldInfo metadata={(props.config as ConfigCellInfo).field} value={props.value as CellValueInfo} />
      </Match>
      <Match when={type() === "format"}>
        <FieldFormat value={props.value as CellValueFormat} />
      </Match>
      <Match when={type() === "genotype"}>
        <FieldGenotype metadata={(props.config as ConfigCellGenotype).field} value={props.value as CellValueGenotype} />
        <></>
      </Match>
      <Match when={type() === "composed"}>
        <FieldComposed
          config={props.config as ConfigCellCustom<CellValueCustom>}
          value={props.value as CellValueCustom}
        />
      </Match>
    </Switch>
  );
};
