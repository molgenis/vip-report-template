import { Component, Match, Switch } from "solid-js";
import { Genotype, RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Field } from "./field/Field";
import { GenotypeField } from "./format/GenotypeField";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

export const Format: Component<{
  format: RecordSampleType;
  formatMetadata: FieldMetadata;
  record: Item<Record>;
  isAbbreviate: boolean;
  allelicBalance: number | undefined | null;
  readDepth: number | undefined;
}> = (props) => {
  return (
    <Switch
      fallback={
        <Field
          info={{ value: props.format as Value | Value[], record: props.record }}
          infoMeta={props.formatMetadata}
          context={{}}
        />
      }
    >
      <Match when={props.formatMetadata.id === "GT"}>
        <GenotypeField
          genotype={props.format as Genotype}
          refAllele={props.record.data.r}
          altAlleles={props.record.data.a}
          isAbbreviate={props.isAbbreviate}
          allelicBalance={props.allelicBalance}
          readDepth={props.readDepth}
        />
      </Match>
    </Switch>
  );
};
