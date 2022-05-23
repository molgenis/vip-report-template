import { Component } from "solid-js";
import { Anchor } from "../../Anchor";
import { Abbr } from "../../Abbr";

export const Consequence: Component<{
  terms: string[];
}> = (props) => {
  const toHref = (term: string) =>
    `http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=${encodeURIComponent(
      term
    )}&release=current_release`;

  return (
    <>
      <Anchor href={toHref(props.terms[0])} value={props.terms[0]} />
      {props.terms.length > 1 && (
        <span>
          , <Abbr title={props.terms.slice(1).join(", ")} value="..."></Abbr>
        </span>
      )}
    </>
  );
};
