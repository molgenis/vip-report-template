import { Component } from "solid-js";

export const Hgvs: Component<{
  notation: string;
}> = (props) => {
  let abbreviated;
  const splitted = props.notation.split(":");
  if (splitted.length === 2) {
    abbreviated = splitted[1];
  } else {
    abbreviated = props.notation;
  }

  return <abbr title={props.notation}>{abbreviated}</abbr>;
};
