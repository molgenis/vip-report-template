import { Component, Show } from "solid-js";
import { Anchor } from "../../Anchor";

export const FieldPubMed: Component<{ value: number[] }> = (props) => {
  const href = () => {
    const ids = props.value;
    if (ids) {
      const term = ids.map((id) => `${id}[UID]`).join("+OR+");
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${term}&sort=pubdate`;
    }
  };

  return (
    <Show when={props.value.length > 0}>
      <Anchor href={href()}>
        <span>{`citations (${props.value.length})`}</span>
      </Anchor>
    </Show>
  );
};
