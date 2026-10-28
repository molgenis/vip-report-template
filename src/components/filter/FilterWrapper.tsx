import "./FilterWrapper.scss";
import { createEffect, createSignal, JSX, onCleanup, onMount, ParentComponent, Show, Signal } from "solid-js";
import { Portal } from "solid-js/web";
import { ConfigFilterBase } from "../../types/configFilter";
import { Tooltip } from "../Tooltip.tsx";

// A filter is active when one of its inputs holds a value; read from the DOM so it works for every filter type.
function hasValue(container: HTMLElement): boolean {
  return Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select")).some((input) =>
    input instanceof HTMLInputElement && (input.type === "checkbox" || input.type === "radio")
      ? input.checked
      : input.value !== "",
  );
}

export const FilterWrapper: ParentComponent<{
  config: ConfigFilterBase;
  error?: string | undefined;
  tooltipContentElement?: JSX.Element; // additional tooltip content
}> = (props) => {
  // filters start closed to keep the sidebar short; ones holding a value open on mount
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(true);
  const [active, setActive]: Signal<boolean> = createSignal(false);
  const [showTooltip, setShowTooltip]: Signal<boolean> = createSignal(false);
  let containerRef: HTMLDivElement | undefined;
  let userToggled = false;

  const label = () => props.config.label();
  const description = () => props.config.description();
  const hasTooltipContent = () => description() || props.tooltipContentElement;

  const updateActive = () => {
    if (containerRef) setActive(hasValue(containerRef));
  };

  onMount(() => {
    // values are restored asynchronously, so check again once they are in
    updateActive();
    for (const delay of [0, 250, 1000]) {
      setTimeout(() => {
        updateActive();
        if (active() && !userToggled) setCollapsed(false);
      }, delay);
    }
  });

  // The tooltip is rendered in the document body at the info button's position, so the
  // scrolling sidebar does not clip it. Scrolling or resizing closes it.
  const [tooltipPosition, setTooltipPosition] = createSignal<{ top: number; left: number }>({ top: 0, left: 0 });
  function toggleShowTooltip(event: MouseEvent) {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPosition({ top: rect.bottom + 4, left: rect.left });
    setShowTooltip(!showTooltip());
  }
  createEffect(() => {
    if (!showTooltip()) return;
    const close = () => setShowTooltip(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    onCleanup(() => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    });
  });

  function toggleCollapse() {
    userToggled = true;
    setCollapsed(!collapsed());
  }

  const ErrorMessage = (props: { error: string | undefined }) => (
    <div class="notification is-danger is-light">{props.error}</div>
  );

  return (
    <div class="filter" classList={{ "is-collapsed": collapsed() }}>
      <header class="filter-header" onClick={toggleCollapse}>
        <span class="chevron" classList={{ "is-open": !collapsed() }} />
        <p class="filter-header-title">
          {label()}
          <Show when={active()}>
            <span class="filter-active-dot" title="This filter is set" />
          </Show>
        </p>
        <Show when={hasTooltipContent()}>
          <button class="filter-header-icon" onClick={toggleShowTooltip}>
            <span class="icon">
              <i class="fas fa-info" />
            </span>
            <Show when={showTooltip()}>
              <Portal>
                <Tooltip
                  text={description()}
                  style={{
                    position: "fixed",
                    top: `${tooltipPosition().top}px`,
                    left: `${tooltipPosition().left}px`,
                    "max-height": `calc(100vh - ${tooltipPosition().top + 12}px)`,
                    "overflow-y": "auto",
                    margin: 0,
                    "z-index": 40,
                  }}
                >
                  {props.tooltipContentElement}
                </Tooltip>
              </Portal>
            </Show>
          </button>
        </Show>
      </header>
      <Show when={props.error !== undefined}>
        <ErrorMessage error={props.error} />
      </Show>
      {/* kept rendered while collapsed so the filter keeps its state and can report whether it is set */}
      <div
        class="filter-container"
        classList={{ "is-hidden": collapsed() }}
        ref={containerRef}
        onChange={updateActive}
        onInput={updateActive}
      >
        {props.children}
      </div>
    </div>
  );
};
