import { Component } from "solid-js";
import { Abbr } from "../../Abbr";
import { Link } from "solid-app-router";

export const Consequence: Component<{
  terms: string[];
  href?: string;
}> = (props) => {
  return (
    <>
      {props.href ? <Link href={props.href}>{props.terms[0]}</Link> : <span>{props.terms[0]}</span>}
      {props.terms.length > 1 && (
        <span>
          , <Abbr title={props.terms.slice(1).join(", ")} value="\u2026"></Abbr>
        </span>
      )}
    </>
  );
};
