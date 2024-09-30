import { Component, For } from "solid-js";
import { isNumerical } from "../utils/field";
import { DIRECTION_ASCENDING, Order } from "../utils/sortUtils";
import { SortOrder } from "@molgenis/vip-report-api/src/Api";
import { infoSortPath } from "../utils/query";

export type SortOption = {
  order: Order;
  selected?: boolean;
};

export type SortChangeEvent = { order: SortOrder };
export type SortChangeCallback = (event: SortChangeEvent) => void;
export type SortClearCallback = () => void;

export const Sort: Component<{
  options: SortOption[];
  onChange: SortChangeCallback;
  onClear: SortClearCallback;
}> = (props) => {
  const sortableOptions = () =>
    props.options.filter((option) => isNumerical(option.order.field) && option.order.field.number.count === 1);

  const onSortChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    if (index === -1) {
      props.onClear();
    } else {
      const sortOption = sortableOptions()[index]!;
      props.onChange({
        order: {
          property: infoSortPath(sortOption.order.field),
          compare: sortOption.order.direction,
        },
      });
    }
  };

  return (
    <div class="control">
      <span class="inline-control-text mr-2">Sort by</span>
      <div class="select">
        <select onChange={onSortChange}>
          <option value="-1">{"Position"}</option>
          <For each={sortableOptions()}>
            {(option, i) => (
              <option value={i()} selected={option.selected === true}>
                {option.order.field.label || option.order.field.id}{" "}
                {option.order.direction === DIRECTION_ASCENDING ? "(ascending)" : "(descending)"}
              </option>
            )}
          </For>
        </select>
      </div>
    </div>
  );
};
