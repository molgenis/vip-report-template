import { Component, createMemo, createSignal, For, Signal } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Info } from "./record/Info";

export const InfoCollapsablePane: Component<{
  fields: FieldMetadata[];
  record: Item<Record>;
}> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  // TODO throw error instead of returning null, remove type cast
  const values = createMemo(
    () =>
      props.fields.map((field) =>
        field.parent
          ? (props.record.data.n[field.parent.id] as ValueArray).map((nestedValues) =>
              field.parent && field.parent.nested
                ? (nestedValues as ValueArray)[
                    field.parent.nested.items.findIndex((nestedField) => nestedField.id === field.id)
                  ]
                : null
            )
          : null
      ) as ValueArray[]
  );

  return (
    <>
      <td>
        {values()[0].length > 1 && (
          <span class="icon is-left is-clickable" onClick={toggleCollapse}>
            {collapsed() ? <i class="fas fa-angle-up" /> : <i class="fas fa-angle-down" />}
          </span>
        )}
      </td>
      <For each={props.fields}>
        {(field, i) => (
          <td>
            <For each={values()[i()]}>
              {(value, j) => (
                <>
                  {j() != 0 && collapsed() && <br />}
                  {(j() == 0 || collapsed()) && <Info info={value} infoMetadata={field} />}
                </>
              )}
            </For>
          </td>
        )}
      </For>
    </>
  );
};
