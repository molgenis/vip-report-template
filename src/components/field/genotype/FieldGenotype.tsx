import { Component, Match, Switch } from "solid-js";
import { FieldTyped } from "../typed/FieldTyped";
import { FieldGenotypeType } from "./FieldGenotypeType";
import { FieldMetadata, Genotype, Value } from "@molgenis/vip-report-vcf";
import { CellValueGenotype } from "../../../types/configCells";

export const FieldGenotype: Component<{
  metadata: FieldMetadata;
  value: CellValueGenotype;
}> = (props) => {
  console.log("testje");
  console.log(props.value);
  // add genotype fields with composed rendering here
  return (
    <Switch fallback={<FieldTyped metadata={props.metadata} value={props.value as Value} />}>
      <Match when={props.metadata.id === "GT"}>
        <FieldGenotypeType value={props.value as Genotype} />
      </Match>
    </Switch>
  );
};
