import { Component, For } from "solid-js";
import { isNumerical } from "../utils/field";
import { SortOrder } from "@molgenis/vip-report-api";
import { DIRECTION_ASCENDING, mapOrder } from "../utils/sortUtils";
import { ConfigSortOption, ConfigSortOrder } from "../types/configSort";

export type SortChangeEvent = { order: SortOrder | SortOrder[] };
export type SortChangeCallback = (event: SortChangeEvent) => void;
export type SortClearCallback = () => void;

export const Sort: Component<{
  options: ConfigSortOption[];
  onChange: SortChangeCallback;
  onClear: SortClearCallback;
}> = (props) => {
  const sortableOptions = () =>
    props.options.filter((option) =>
      option.orders.every((order) => isNumerical(order.field) && order.field.number.count === 1),
    );
  const onSortChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    if (index === -1) {
      props.onClear();
    } else {
      const sortOption = sortableOptions()[index]!;
      props.onChange({
        order: sortOption.orders.map((order) => mapOrder(order)),
      });
    }
  };

  function getLabel(orders: ConfigSortOrder[]) {
    return orders.length > 0 && orders[0] !== undefined
      ? `${orders[0].field.label || orders[0].field.id} ${orders[0].direction === DIRECTION_ASCENDING ? "(ascending)" : "(descending)"}`
      : " ";
  }

  return (
    <div class="control">
      <span class="inline-control-text mr-2">Sort by</span>
      <div class="select">
        <select onChange={onSortChange}>
          <option value="-1">{"Position"}</option>
          <For each={sortableOptions()}>
            {(option, i) => (
              <option value={i()} selected={option.selected === true}>
                {getLabel(option.orders)}
              </option>
            )}
          </For>
        </select>
      </div>
    </div>
  );
};
