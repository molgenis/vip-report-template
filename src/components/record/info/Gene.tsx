import { Component } from "solid-js";
import { Anchor } from "../../Anchor";

export const Gene: Component<{
  symbol: string;
}> = (props) => {
  const toHref = (symbol: string) =>
    `https://www.genenames.org/tools/search/#!/?query=${symbol}&filter=document_type:%22gene%22`;

  return <Anchor href={toHref(props.symbol)} value={props.symbol} />;
};
