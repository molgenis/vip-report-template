import "./FilterWrapper.scss";
import { createSignal, JSX, ParentComponent, Show, Signal } from "solid-js";

export interface FilterValueChangeEvent<FilterValueType> {
  value: FilterValueType;
}

export type FilterValueChangeCallback<FilterValueType> = (event: FilterValueChangeEvent<FilterValueType>) => void;
export type FilterValueClearCallback = () => void;

export interface FilterProps {
  label: string;
  tooltip?: JSX.Element;
  isCollapsible?: boolean;
}

export interface FilterTypedProps<FilterValueType> extends FilterProps {
  value?: FilterValueType;
  onValueChange: FilterValueChangeCallback<FilterValueType>;
  onValueClear: FilterValueClearCallback;
}

export const FilterWrapper: ParentComponent<FilterProps> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);
  const [showTooltip, setShowTooltip]: Signal<boolean> = createSignal(false);

  function toggleShowTooltip() {
    setShowTooltip(!showTooltip());
  }

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  return (
    <div class="filter">
      <header class="filter-header">
        <p class="filter-header-title">{props.label}</p>
        <Show when={props.tooltip}>
          <button class="filter-header-icon" onClick={toggleShowTooltip}>
            <span class="icon">
              <i class="fas fa-info" />
            </span>
            <Show when={showTooltip()}>
              <div class="tooltip has-background-dark has-text-light">{props.tooltip}</div>
            </Show>
          </button>
        </Show>
        <Show when={props.isCollapsible}>
          <button class="filter-header-icon" onClick={toggleCollapse}>
            <span class="icon">
              <Show when={collapsed()} fallback={<i class="fas fa-angle-up" />}>
                <i class="fas fa-angle-down" />
              </Show>
            </span>
          </button>
        </Show>
      </header>
      <Show when={!collapsed()}>
        <div class="filter-container">{props.children}</div>
      </Show>
    </div>
  );
};
