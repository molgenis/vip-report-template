import { ParentComponent, Show } from "solid-js";

export const Anchor: ParentComponent<{
  href: string | null | undefined;
}> = (props) => {
  return (
    <Show when={props.href} fallback={props.children} keyed>
      {(href) => (
        <a href={href} target="_blank" rel="noopener noreferrer nofollow">
          {props.children}
        </a>
      )}
    </Show>
  );
};
