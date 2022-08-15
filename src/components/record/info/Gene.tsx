import { Component, createMemo, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";
import { ValueFlag, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";
import { Abbr } from "../../Abbr";

export const Gene: Component<FieldProps> = (props) => {
  const symbol = (): ValueString => props.info.value as ValueString;

  const symbolSource = createMemo((): ValueString | undefined => {
    if (symbol() === null) return undefined;

    const symbolSourceFieldIndex = getCsqInfoIndex(props.infoMeta, "SYMBOL_SOURCE");
    return symbolSourceFieldIndex !== -1 ? (getCsqInfo(props.info, symbolSourceFieldIndex) as ValueString) : undefined;
  });

  const geneId = createMemo((): ValueString | undefined => {
    if (symbol() === null) return undefined;

    const geneFieldIndex = getCsqInfoIndex(props.infoMeta, "Gene");
    return geneFieldIndex !== -1 ? (getCsqInfo(props.info, geneFieldIndex) as ValueString) : undefined;
  });

  const href = (): string | undefined => {
    if (symbol() === null) return undefined;

    const queryString =
      symbolSource() === "EntrezGene" && geneId()
        ? `query=ncbi_gene_id:${geneId()!}`
        : `query=${encodeURIComponent(symbol()!)}&filter=document_type:%22gene%22`;
    return `https://www.genenames.org/tools/search/#!/?${queryString}`;
  };

  const incompletePenetrance = (): ValueFlag | undefined => {
    const ipFieldIndex = getCsqInfoIndex(props.infoMeta, "IncompletePenetrance");
    return ipFieldIndex !== -1 ? (getCsqInfo(props.info, ipFieldIndex) as ValueFlag) : undefined;
  };

  return (
    <Show when={symbol()}>
      {(symbol) => (
        <>
          <Anchor href={href()}>
            <span>{symbol}</span>
          </Anchor>
          {incompletePenetrance() && (
            <span class="ml-1">
              <Abbr title="gene is known for incomplete penetrance" value="IP" />
            </span>
          )}
        </>
      )}
    </Show>
  );
};
