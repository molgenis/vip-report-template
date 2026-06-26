import { Component, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { Abbr } from "../../Abbr";
import { CellValueGene } from "../../../types/configCellComposed";

export const FieldGene: Component<{
  value: CellValueGene;
}> = (props) => {
  const href = (): string | null => {
    const symbol = props.value.symbol;
    if (symbol === null) return null;

    const geneIdentifier = props.value.geneIdentifier;
    const queryString =
      props.value.symbolSource === "EntrezGene" && geneIdentifier
        ? `query=ncbi_gene_id:${geneIdentifier}`
        : `query=${encodeURIComponent(symbol)}&filter=document_type:%22gene%22`;
    return `https://www.genenames.org/tools/search/#!/?${queryString}`;
  };

  return (
    <Show when={props.value.symbol} keyed>
      {(symbol) => (
        <>
          <Anchor href={href()}>
            <span>{symbol}</span>
          </Anchor>
          {props.value.incompletePenetrance && props.value.incompletePenetrance.value === "1" && (
            <span class="ml-1">
              <Show when={props.value.incompletePenetrance.description} fallback={"IP"}>
                {(description) => <Abbr title={description()} value="IP" />}
              </Show>
            </span>
          )}
        </>
      )}
    </Show>
  );
};
