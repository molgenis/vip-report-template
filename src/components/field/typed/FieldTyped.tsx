import { Component } from "solid-js";
import { FieldTypedItem, FieldValueSingle } from "./FieldTypedItem";
import { FieldTypedMultiple } from "./FieldTypedMultiple";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { CellValueFormat, CellValueInfo } from "../../../types/configCells";

export const FieldTyped: Component<{
  metadata: FieldMetadata;
  value: CellValueInfo | CellValueFormat;
}> = (props) => {
  return (
    <>
      {props.metadata.number.count === 0 || props.metadata.number.count === 1 ? (
        <FieldTypedItem value={props.value as FieldValueSingle | undefined} metadata={props.metadata} />
      ) : (
        <FieldTypedMultiple info={props.value as FieldValueSingle[]} infoMetadata={props.metadata} />
      )}
    </>
  );
};
