import { Component } from "solid-js";

export const Anchor: Component<{
  href: string;
  value: string | number;
}> = (props) => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer nofollow">
      {props.value}
    </a>
  );
};
