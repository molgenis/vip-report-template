import { Component } from "solid-js";

function abbreviate(notation: string): string {
  let abbreviated;
  const splitted = notation.split(":");
  if (splitted.length === 2) {
    abbreviated = splitted[1];
  } else {
    abbreviated = notation;
  }
  return abbreviated;
}
export const Hgvs: Component<{
  notation: string;
}> = (props) => {
  return <abbr title={props.notation}>{abbreviate(props.notation)}</abbr>;
};
