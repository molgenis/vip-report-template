import { Component, createMemo, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";

export const Gene: Component<FieldProps> = (props) => {
  const symbol = (): string | null => props.info.value as ValueString;

  const symbolSource = createMemo((): string | undefined => {
    if (symbol() === null) return undefined;

    const symbolSourceFieldIndex = getCsqInfoIndex(props.infoMeta, "SYMBOL_SOURCE");
    return symbolSourceFieldIndex !== -1 ? (getCsqInfo(props.info, symbolSourceFieldIndex) as string) : undefined;
  });

  const geneId = createMemo((): string | undefined => {
    if (symbol() === null) return undefined;

    const geneFieldIndex = getCsqInfoIndex(props.infoMeta, "Gene");
    return geneFieldIndex !== -1 ? (getCsqInfo(props.info, geneFieldIndex) as string) : undefined;
  });

  const href = (): string | undefined => {
    if (symbol() === null) return undefined;

    const queryString =
      symbolSource() === "EntrezGene" && geneId()
        ? `query=ncbi_gene_id:${geneId()!}`
        : `query=${encodeURIComponent(symbol()!)}&filter=document_type:%22gene%22`;
    return `https://www.genenames.org/tools/search/#!/?${queryString}`;
  };

  return (
    <Show when={symbol()}>
      {(symbol) => (
        <Anchor href={href()}>
          <span>{symbol}</span>
        </Anchor>
      )}
    </Show>
  );
};
