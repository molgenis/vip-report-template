import { Component, For } from "solid-js";
import { Value } from "../api/vcf/ValueParser";
import { Info } from "./record/Info";
import { FieldMetadata, InfoMetadata } from "../api/vcf/MetadataParser";

function isNonEmptyNestedInfoItem(nestedInfoField: FieldMetadata, index: number, value: Value[] | Value[][]): boolean {
  const infoField = nestedInfoField.nested?.items[index];

  let empty;
  if (nestedInfoField.number.count === 0 || nestedInfoField.number.count === 1) {
    empty = (value as Value[])[index] === null;
  } else {
    empty = true;
    for (const subValue of value as Value[][]) {
      if (infoField.number.count === 0 || infoField.number.count === 1) {
        if (subValue[index] !== null) {
          empty = false;
          break;
        }
      } else {
        if ((subValue as Value[][])[index].length > 0) {
          empty = false;
          break;
        }
      }
    }
  }
  return !empty;
}

export const VariantInfoNestedTable: Component<{
  iinfoValue: Value[][];
  infoField: InfoMetadata;
  variant: { id: number; label: string };
  sample: { id: number; label: string } | null;
}> = (props) => {
  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <For each={props.infoField.nested.items}>
              {(infoFieldItem, i) => (
                <>
                  {isNonEmptyNestedInfoItem(props.infoField, i(), props.infoValue) && (
                    <th style="writing-mode: vertical-rl">{infoFieldItem.id}</th>
                  )}
                </>
              )}
            </For>
          </thead>
          <tbody>
            <For each={props.infoValue}>
              {(value, rowIndex) => (
                <>
                  <tr>
                    <For each={props.infoField.nested.items}>
                      {(infoFieldItem, i) => (
                        <>
                          {isNonEmptyNestedInfoItem(props.infoField, i(), props.infoValue) && (
                            <td>
                              <Info info={value[i()]} infoMetadata={infoFieldItem} />
                            </td>
                          )}
                        </>
                      )}
                    </For>
                  </tr>
                </>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
