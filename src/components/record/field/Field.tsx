import { Component } from "solid-js";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldSingleValue } from "./FieldSingleValue";
import { FieldMultipleValue } from "./FieldMultipleValue";

export const Field: Component<{
  info: Value | Value[];
  infoMetadata: FieldMetadata;
}> = (props) => {
  return (
    <>
      {props.infoMetadata.number.count === 1 ? (
        <FieldSingleValue info={props.info as Value} infoMetadata={props.infoMetadata} />
      ) : (
        <FieldMultipleValue info={props.info as Value[]} infoMetadata={props.infoMetadata} />
      )}
    </>
  );
};
