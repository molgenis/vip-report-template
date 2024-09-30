import { Component, Match, Switch } from "solid-js";
import { FieldTyped } from "../typed/FieldTyped";
import { FieldGenotypeType } from "./FieldGenotypeType";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueGenotype, ConfigCellGenotype } from "../../../types/configCell";

export const FieldGenotype: Component<{
  config: ConfigCellGenotype;
  value: CellValueGenotype;
}> = (props) => {
  // add genotype fields with composed rendering here
  return (
    <Switch fallback={<FieldTyped metadata={props.config.field} value={props.value as Value} />}>
      <Match when={props.config.field.id === "GT"}>
        <FieldGenotypeType value={props.value as Genotype} />
      </Match>
    </Switch>
  );
};
