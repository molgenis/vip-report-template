import { Component } from "solid-js";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldSingleValue } from "./FieldSingleValue";
import { FieldMultipleValue } from "./FieldMultipleValue";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

export type FieldProps = {
  info: FieldValue;
  infoMeta: FieldMetadata;
  context: FieldContext;
};

export type FieldValue = {
  value: Value | Value[];
  valueParent?: Value | Value[];
  record: Item<Record>;
};

export type FieldContext = {
  genomeAssembly?: string;
  isPossibleCompound?: boolean;
};

export const Field: Component<FieldProps> = (props) => {
  return (
    <>
      {props.infoMeta.number.count === 1 ? (
        <FieldSingleValue info={props.info.value as Value} infoMetadata={props.infoMeta} />
      ) : (
        <FieldMultipleValue info={props.info.value as Value[]} infoMetadata={props.infoMeta} />
      )}
    </>
  );
};
