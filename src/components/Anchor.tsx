import { Component, JSXElement } from "solid-js";

export const Anchor: Component<{
  href: string;
  value: string | number | JSXElement;
}> = (props) => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer nofollow">
      {props.value}
    </a>
  );
};
