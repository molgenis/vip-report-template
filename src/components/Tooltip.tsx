import { For, ParentComponent } from "solid-js";
import { Anchor } from "./Anchor.tsx";

export const Tooltip: ParentComponent<{
  text: string | null;
}> = (props) => {
  const elements = () =>
    props.text
      ? props.text
          .split(" ", -1)
          .map((token) => (token.startsWith("http") ? <Anchor href={token}>{token + " "}</Anchor> : token + " "))
      : [];

  return (
    <div class="tooltip has-background-dark has-text-light">
      <For each={elements()}>{(element) => element}</For>
      {props.children}
    </div>
  );
};
