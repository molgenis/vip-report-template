import { Component } from "solid-js";

export const HGVS: Component<{
  notation: string;
}> = (props) => {
  let abbriviated;
  const splitted = props.notation.split(":");
  if (splitted.length === 2) {
    abbriviated = splitted[1];
  } else {
    abbriviated = props.notation;
  }

  return <span data-tooltip={props.notation}>{abbriviated}</span>;
};
