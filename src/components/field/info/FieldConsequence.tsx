import { Component, Show } from "solid-js";
import { Abbr } from "../../Abbr";
import { ValueCategorical } from "../../../utils/vcf.ts";

export const FieldConsequence: Component<{ value: ValueCategorical[] }> = (props) => {
  return (
    <Show when={props.value?.length > 0}>
      <span>
        {props.value[0]?.label}
        {props.value.length > 1 && (
          <>
            ,{" "}
            <Abbr
              title={props.value
                .slice(1)
                .filter((csq) => csq !== null)
                .map((csq) => csq.label)
                .join(", ")}
              value="…"
            />
          </>
        )}
      </span>
    </Show>
  );
};
