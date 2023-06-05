import { Component, For } from "solid-js";
import { isNumerical } from "../utils/field";
import { DIRECTION_ASCENDING, Order } from "../utils/sortUtils";
import { SortOrder } from "@molgenis/vip-report-api/src/Api";
import { infoSortPath } from "../utils/query";

export type SortOption = {
  order: Order;
  selected?: boolean;
};

export type SortEvent = { order: SortOrder };

export const Sort: Component<{
  options: SortOption[];
  onChange: (event: SortEvent) => void;
  onClear: () => void;
}> = (props) => {
  const sortableOptions = () =>
    props.options.filter(
      (option) =>
        (isNumerical(option.order.field) && option.order.field.number.count === 1) || option.order.field.id === "Zscore"
    );

  const onSortChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    index === -1
      ? props.onClear()
      : props.onChange({
          order: {
            property: infoSortPath(sortableOptions()[index].order.field),
            compare: sortableOptions()[index].order.direction,
          },
        });
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
