import { Component, For } from "solid-js";
import { isNumerical } from "../utils/field";
import { DIRECTION_ASCENDING, Order } from "../utils/sortUtils";

export type SortOption = {
  order: Order;
  selected?: boolean;
};

export type SortEvent = { order: Order | null };

export const Sort: Component<{
  options: SortOption[];
  onChange: (event: SortEvent) => void;
  onClear: () => void;
}> = (props) => {
  const sortableOptions = () =>
    props.options.filter((option) => isNumerical(option.order.field) && option.order.field.number.count === 1);

  const onSortChange = (event: Event) => {
    const index = Number((event.target as HTMLInputElement).value);
    index === -1 ? props.onClear() : props.onChange({ order: sortableOptions()[index].order });
  };

  return (
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Sort by:</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="select">
            <select onChange={onSortChange}>
              <option value="-1"></option>
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
      </div>
    </div>
  );
};
