import { Component } from "solid-js";
import { Anchor } from "../../Anchor";

export const PubMed: Component<{
  ids: number[];
}> = (props) => {
  const term = props.ids.map((pubMedId) => `${pubMedId}[UID]`).join("+OR+");

  return (
    <>
      {term.length > 0 && (
        <Anchor
          href={`https://pubmed.ncbi.nlm.nih.gov/?term=${term}&sort=pubdate`}
          value={`citations (${props.ids.length})`}
        />
      )}
    </>
  );
};
