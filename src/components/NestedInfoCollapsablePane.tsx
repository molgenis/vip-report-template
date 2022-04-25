import { Component, createSignal, For, Signal } from "solid-js";
import { Value } from "../api/vcf/ValueParser";
import { Info } from "./record/Info";
import { NestedFieldMetadata } from "../api/vcf/MetadataParser";
import { Metadata, Record } from "../api/vcf/Vcf";
import { Item } from "../api/Api";

export const NestedInfoCollapsablePane: Component<{
  recordsMetadata: Metadata;
  indices: number[];
  record: Item<Record>;
}> = (props) => {
  const infoFields = Object.values(props.recordsMetadata.info);

  const infoPositions = infoFields.map(function (infoField) {
    return infoField.id;
  });

  const infoFieldVepIdx = infoPositions.indexOf("CSQ");

  const vepField = infoFields[infoFieldVepIdx];
  const nestedVepItems: NestedFieldMetadata | undefined = vepField != undefined ? vepField.nested : undefined;

  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);

  function toggle() {
    setCollapsed(!collapsed());
  }

  // FIXME remove 'as unknown' after InfoContainer type fix
  const infoVepValues = vepField !== undefined ? (props.record.data.n[vepField.id] as unknown as Value[][]) : [];

  return (
    <>
      <td>
        {infoVepValues.length > 1 && (
          <span class="icon is-left is-clickable" onClick={toggle}>
            {collapsed() ? <i class="fa-solid fa-angle-up" /> : <i class="fa-solid fa-angle-down" />}
          </span>
        )}
      </td>
      <For each={props.indices}>
        {(idx: number) => (
          <td>
            {idx > -1 ? (
              <For each={infoVepValues}>
                {(value, j) => (
                  <>
                    {j() != 0 && collapsed() && <br />}
                    {(j() == 0 || collapsed()) && nestedVepItems !== undefined && (
                      <Info info={value[idx]} infoMetadata={nestedVepItems.items[idx]} />
                    )}
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
