import { Component } from "solid-js";
import { FieldTypedItem, FieldValueSingle } from "./FieldTypedItem";
import { FieldTypedMultiple } from "./FieldTypedMultiple";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { CellValueFormat, CellValueInfo } from "../../../types/configCell";

export const FieldTyped: Component<{
  metadata: FieldMetadata;
  value: CellValueInfo | CellValueFormat;
}> = (props) => {
  return (
    <>
      {props.metadata.number.count === 1 ? (
        <FieldTypedItem value={props.value as FieldValueSingle | undefined} metadata={props.metadata} />
      ) : (
        <FieldTypedMultiple info={props.value as FieldValueSingle[]} infoMetadata={props.metadata} />
      )}
    </>
  );
};
