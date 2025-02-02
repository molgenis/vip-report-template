import "./FilterWrapper.scss";
import { createSignal, JSX, ParentComponent, Show, Signal } from "solid-js";
import { ConfigFilterBase } from "../../types/configFilter";
import { Tooltip } from "../Tooltip.tsx";

export const FilterWrapper: ParentComponent<{
  config: ConfigFilterBase;
  error?: string | undefined;
  tooltipContentElement?: JSX.Element; // additional tooltip content
}> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);
  const [showTooltip, setShowTooltip]: Signal<boolean> = createSignal(false);

  const isCollapsible = () => false; // TODO add to config filter base
  const label = () => props.config.label();
  const description = () => props.config.description();
  const hasTooltipContent = () => description() || props.tooltipContentElement;

  function toggleShowTooltip() {
    setShowTooltip(!showTooltip());
  }

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  const ErrorMessage = (props: { error: string | undefined }) => (
    <div class="notification is-danger is-light">{props.error}</div>
  );

  return (
    <div class="filter">
      <header class="filter-header">
        <p class="filter-header-title">{label()}</p>
        <Show when={hasTooltipContent()}>
          <button class="filter-header-icon" onClick={toggleShowTooltip}>
            <span class="icon">
              <i class="fas fa-info" />
            </span>
            <Show when={showTooltip()}>
              <Tooltip text={description()}>{props.tooltipContentElement}</Tooltip>
            </Show>
          </button>
        </Show>
        <Show when={isCollapsible()}>
          <button class="filter-header-icon" onClick={toggleCollapse}>
            <span class="icon">
              <Show when={collapsed()} fallback={<i class="fas fa-angle-up" />}>
                <i class="fas fa-angle-down" />
              </Show>
            </span>
          </button>
        </Show>
      </header>
      <Show when={props.error !== undefined}>
        <ErrorMessage error={props.error} />
      </Show>
      <Show when={!collapsed()}>
        <div class="filter-container">{props.children}</div>
      </Show>
    </div>
  );
};
