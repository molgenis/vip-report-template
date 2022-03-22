import { Component, For } from "solid-js";
import { Anchor } from "../../Anchor";

export const Consequence: Component<{
  terms: string[];
}> = (props) => {
  const toHref = (term: string) =>
    `http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=${encodeURIComponent(
      term
    )}&release=current_release`;

  return (
    <>
      <For each={props.terms}>
        {(value, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <Anchor href={toHref(value)} value={value} />
          </>
        )}
      </For>
    </>
  );
};
