import { Component, createSignal, For, Show, Signal } from "solid-js";
import { Value } from "../api/vcf/ValueParser";
import { Info } from "./record/Info";
import { NestedFieldMetadata } from "../api/vcf/MetadataParser";
import { Metadata, Record } from "../api/vcf/Vcf";
import { Item } from "../api/Api";

export const NestedInfoCollapsablePane: Component<{
  recordsMetadata: Metadata;
  fields: string[];
  record: Item<Record>;
}> = (props) => {
  const infoFields = Object.values(props.recordsMetadata.info);

  const infoPositions = infoFields.map(function (infoField) {
    return infoField.id;
  });

  const infoFieldVepIdx = infoPositions.indexOf("CSQ");

  const vepField = infoFields[infoFieldVepIdx];
  if (vepField.nested === undefined) {
    throw new Error("No nested fields found for VEP annotation");
  }

  const nestedVepItems: NestedFieldMetadata = vepField.nested;
  const indices = getIndices(props.fields);

  function getIndices(fields: string[]) {
    const positions = nestedVepItems
      ? nestedVepItems.items.map(function (csqField) {
          return csqField.id;
        })
      : [];
    const indices: number[] = [];
    fields.forEach((field) => {
      indices.push(positions.indexOf(field));
    });
    return indices;
  }

  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);

  function toggle() {
    setCollapsed(!collapsed());
  }

  return (
    <>
      <td>
        <a class="button is-small" onClick={toggle}>
          <span class="icon is-left">
            <Show when={collapsed() === false} fallback={<i class="fa-solid fa-angle-down"></i>}>
              <i class="fa-solid fa-angle-right"></i>
            </Show>
          </span>
        </a>
      </td>
      <For each={indices}>
        {(idx: number) => (
          <td>
            {idx > -1 ? (
              <For each={props.record.data.n[vepField.id] as unknown as Value[][]}>
                {(value, j) => (
                  <>
                    {j() != 0 && collapsed() && <br />}
                    {(j() == 0 || collapsed()) && <Info info={value[idx]} infoMetadata={nestedVepItems.items[idx]} />}
                  </>
                )}
              </For>
            ) : (
              ""
            )}
          </td>
        )}
      </For>
    </>
  );
};
