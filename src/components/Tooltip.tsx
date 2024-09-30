import { Component, For } from "solid-js";
import { Anchor } from "./Anchor.tsx";

export const Tooltip: Component<{
  text: string;
}> = (props) => {
  const elements = () =>
    props.text
      .split(" ", -1)
      .map((token) => (token.startsWith("http") ? <Anchor href={token}>{token + " "}</Anchor> : token + " "));

  return (
    <p>
      <For each={elements()}>{(element) => element}</For>
    </p>
  );
};
