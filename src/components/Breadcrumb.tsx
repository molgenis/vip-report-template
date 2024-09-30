import { Component, For } from "solid-js";
import { A } from "@solidjs/router";

export type BreadcrumbItem = { href?: string; text: string };

export const Breadcrumb: Component<{
  items: BreadcrumbItem[];
}> = (props) => {
  return (
    <div class="columns is-gapless">
      <div class="column">
        <nav class="breadcrumb has-succeeds-separator">
          <ul>
            <li classList={{ "is-active": props.items.length === 0 }}>
              <A href="/" end={true}>
                <span class="icon is-small mr-2">
                  <i class="fas fa-home" />
                </span>
                <span>Report</span>
              </A>
            </li>
            <For each={props.items}>
              {(link, i) => (
                <li classList={{ "is-active": i() === props.items.length - 1 }}>
                  <A href={link.href || "#"} end={true}>
                    {link.text}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  );
};
