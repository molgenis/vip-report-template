import { For, JSX, ParentComponent } from "solid-js";
import { Anchor } from "./Anchor.tsx";

export const Tooltip: ParentComponent<{
  text: string | null;
  style?: JSX.CSSProperties;
}> = (props) => {
  const elements = () =>
    props.text
      ? props.text
          .split(" ", -1)
          .map((token) => (token.startsWith("http") ? <Anchor href={token}>{token + " "}</Anchor> : token + " "))
      : [];

  return (
    <div class="tooltip has-background-dark has-text-light" style={props.style}>
      <For each={elements()}>{(element) => element}</For>
      {props.children}
    </div>
  );
};
