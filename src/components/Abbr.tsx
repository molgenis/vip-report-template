import { Component } from "solid-js";

const onClick = (event: Event) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const text: string = event.target !== null ? (event.target["title"] as string) : "";
  void navigator.clipboard.writeText(text);
};

export const Abbr: Component<{
  title: string;
  value: string | number;
  classList?: {
    [k: string]: boolean | undefined;
  };
}> = (props) => {
  return (
    <abbr title={props.title} onClick={onClick} classList={props.classList ? props.classList : {}}>
      {props.value}
    </abbr>
  );
};
