import { Component, Match, Switch } from "solid-js";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldCustomGenotypeField } from "./FieldCustomGenotypeField";
import { FieldCustomLocus } from "./FieldCustomLocus";
import { FieldCustomRef } from "./FieldCustomRef";
import {
  ConfigFieldCustom,
  ConfigFieldCustomGenotype,
  ConfigFieldCustomLocus,
  ConfigFieldCustomRef,
} from "../../../../types/configFieldCustom";

export const FieldCustom: Component<{
  fieldConfig: ConfigFieldCustom;
  record: Item<Record>;
}> = (props) => {
  return (
    <Switch fallback={<td>FIXME</td>}>
      <Match when={props.fieldConfig.id === "genotype"}>
        <FieldCustomGenotypeField fieldConfig={props.fieldConfig as ConfigFieldCustomGenotype} record={props.record} />
      </Match>
      <Match when={props.fieldConfig.id === "locus"}>
        <FieldCustomLocus fieldConfig={props.fieldConfig as ConfigFieldCustomLocus} record={props.record} />
      </Match>
      <Match when={props.fieldConfig.id === "ref"}>
        <FieldCustomRef fieldConfig={props.fieldConfig as ConfigFieldCustomRef} record={props.record} />
      </Match>
    </Switch>
  );
};
