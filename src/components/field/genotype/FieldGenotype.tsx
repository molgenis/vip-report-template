import { Component, Match, Switch } from "solid-js";
import { FieldTyped } from "../typed/FieldTyped";
import { FieldGenotypeType } from "./FieldGenotypeType";
import { Genotype } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueGenotype } from "../../../types/configCell";
import { FieldMetadata } from "../../../../../vip-report-vcf/src/types/Metadata";

export const FieldGenotype: Component<{
  metadata: FieldMetadata;
  value: CellValueGenotype;
}> = (props) => {
  // add genotype fields with composed rendering here
  return (
    <Switch fallback={<FieldTyped metadata={props.metadata} value={props.value as Value} />}>
      <Match when={props.metadata.id === "GT"}>
        <FieldGenotypeType value={props.value as Genotype} />
      </Match>
    </Switch>
  );
};
