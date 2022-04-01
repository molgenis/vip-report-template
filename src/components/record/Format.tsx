import { Component, Match, Switch } from "solid-js";
import { Genotype, RecordSampleType } from "../../api/vcf/SampleDataParser";
import { Value } from "../../api/vcf/ValueParser";
import { FieldMetadata } from "../../api/vcf/MetadataParser";
import { Field } from "./field/Field";
import { GenotypeField } from "./format/GenotypeField";
import { Record } from "../../api/vcf/Vcf";

export const Format: Component<{ format: RecordSampleType; formatMetadata: FieldMetadata; record: Record }> = (
  props
) => {
  return (
    <Switch fallback={<Field info={props.format as Value | Value[]} infoMetadata={props.formatMetadata} />}>
      <Match when={props.formatMetadata.id === "GT"}>
        <GenotypeField genotype={props.format as Genotype} refAllele={props.record.r} altAlleles={props.record.a} />
      </Match>
    </Switch>
  );
};
