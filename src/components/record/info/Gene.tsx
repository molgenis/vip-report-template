import { Component, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";

export const Gene: Component<FieldProps> = (props) => {
  const symbol = () => props.info.value as ValueString;
  // TODO use gene source and gene id to build hyperlinks, e.g. https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:24086
  return (
    <Show when={symbol()}>
      {(symbol) => (
        <Anchor href={`https://www.genenames.org/tools/search/#!/?query=${symbol}&filter=document_type:%22gene%22`}>
          <span>{symbol}</span>
        </Anchor>
      )}
    </Show>
  );
};
