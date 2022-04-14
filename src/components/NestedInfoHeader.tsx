import { Component, createSignal, For, Show, Signal } from "solid-js";
import { Value } from "../api/vcf/ValueParser";
import { Info } from "./record/Info";
import { NestedFieldMetadata } from "../api/vcf/MetadataParser";
import { Metadata, Record } from "../api/vcf/Vcf";
import { Item } from "../api/Api";

export const NestedInfoHeader: Component<{
  fields: string[];
}> = (props) => {
  return <For each={props.fields}>{(field) => <th>{field}</th>}</For>;
};
