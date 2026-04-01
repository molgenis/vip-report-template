import { JSX, ParentProps, createSignal, Show } from "solid-js";

type CollapsiblePaneProps = ParentProps<{
  title?: string;
  defaultOpen?: boolean;
  headerRight?: JSX.Element;
  class?: string;
}>;

export function CollapsiblePane(props: CollapsiblePaneProps) {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false);

  return (
    <section class={`pane ${props.class ?? ""}`}>
      <header class="pane-header">
        <button type="button" class="button is-small is-info" onClick={() => setOpen(!open())}>
          <span class="pane-toggle-icon">
            {open() ? <i class="fas fa-angle-down"/> : <i class="fas fa-angle-right"/>}
          </span>
          <span class="pane-toggle-title">{props.title}</span>
        </button>
        <div class="pane-header-right">{props.headerRight}</div>
      </header>

      <div classList={{ "pane-content": true, "pane-content--open": open() }}>
        <Show when={open()}>{props.children}</Show>
      </div>
    </section>
  );
}