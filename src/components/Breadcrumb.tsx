import { Component, For } from "solid-js";

export type BreadCrumbItem = { href?: string; text: string };

export const Breadcrumb: Component<{
  items: BreadCrumbItem[];
}> = (props) => {
  return (
    <div class="columns is-gapless">
      <div class="column">
        <nav class="breadcrumb has-succeeds-separator">
          <ul>
            <li classList={{ "is-active": props.items.length === 0 }}>
              <a href="/">
                <span class="icon is-small mr-2">
                  <i class="fas fa-home" />
                </span>
                <span>Report</span>
              </a>
            </li>
            <For each={props.items}>
              {(link, i) => (
                <li classList={{ "is-active": i() === props.items.length - 1 }}>
                  <a href={link.href || "#"}>{link.text}</a>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  );
};
