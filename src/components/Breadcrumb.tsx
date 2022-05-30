import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";

export const Breadcrumb: Component<{
  links: { href: string; label: string }[];
}> = (props) => {
  return (
    <div class="columns is-gapless">
      <div class="column">
        <nav class="breadcrumb">
          <ul>
            <Show
              when={props.links.length == 0}
              fallback={
                <li>
                  <Link href="/">
                    <span class="icon">
                      <i class="fas fa-home" />
                    </span>
                  </Link>
                </li>
              }
            >
              <li class="is-active">
                <Link href="#">
                  <span class="icon">
                    <i class="fas fa-home" />
                  </span>
                </Link>
              </li>
            </Show>
            <For each={props.links}>
              {(value) => (
                <Show
                  when={value.href == "#"}
                  fallback={
                    <li>
                      <Link href={value.href}>{value.label}</Link>
                    </li>
                  }
                >
                  <li class="is-active">
                    <Link href={value.href}>{value.label}</Link>
                  </li>
                </Show>
              )}
            </For>
          </ul>
        </nav>
      </div>
    </div>
  );
};
