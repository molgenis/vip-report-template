import { Component, Match, Switch } from "solid-js";
import { Genotype, RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Field } from "./field/Field";
import { GenotypeField } from "./format/GenotypeField";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export const Format: Component<{
  format: RecordSampleType;
  formatMetadata: FieldMetadata;
  record: Record;
  isAbbreviate: boolean;
  allelicDepth: number[] | undefined;
  readDepth: number | undefined;
}> = (props) => {
  return (
    <Switch fallback={<Field info={props.format as Value | Value[]} infoMetadata={props.formatMetadata} />}>
      <Match when={props.formatMetadata.id === "GT"}>
        <GenotypeField
          genotype={props.format as Genotype}
          refAllele={props.record.r}
          altAlleles={props.record.a}
          isAbbreviate={props.isAbbreviate}
          allelicDepth={props.allelicDepth}
          readDepth={props.readDepth}
        />
      </Match>
    </Switch>
  );
};
