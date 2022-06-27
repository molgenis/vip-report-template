import { Component, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";

export const PubMed: Component<FieldProps> = (props) => {
  const pubmedIds = () => props.info.value as number[];

  const href = () => {
    const ids = pubmedIds();
    if (ids) {
      const term = ids.map((id) => `${id}[UID]`).join("+OR+");
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${term}&sort=pubdate`;
    }
  };

  return (
    <Show when={pubmedIds().length > 0}>
      <Anchor href={href()}>
        <span>{`citations (${pubmedIds().length})`}</span>
      </Anchor>
    </Show>
  );
};
