import { Link } from "solid-app-router";
import { Component, For } from "solid-js";

export type BreadCrumbItem = { href?: string; text: string };

export const Breadcrumb: Component<{
  items: BreadCrumbItem[];
}> = (props) => {
  return (
    <div class="columns is-gapless">
      <div class="column">
        <nav class="breadcrumb">
          <ul>
            <li classList={{ "is-active": props.items.length === 0 }}>
              <Link href="/">
                <span class="icon">
                  <i class="fas fa-home" />
                </span>
              </Link>
            </li>
            <For each={props.items}>
              {(link, i) => (
                <li classList={{ "is-active": i() === props.items.length - 1 }}>
                  <Link href={link.href || "#"}>{link.text}</Link>
                </li>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  );
};
