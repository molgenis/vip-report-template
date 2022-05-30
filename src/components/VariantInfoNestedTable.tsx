import { Component, For, Show } from "solid-js";
import { Link } from "solid-app-router";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Info } from "./record/Info";
import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldHeader } from "./FieldHeader";

function isNonEmptyNestedInfoItem(nestedInfoField: FieldMetadata, index: number, value: Value[] | Value[][]): boolean {
  const infoField = nestedInfoField.nested?.items[index];

  let empty;
  if (nestedInfoField.number.count === 0 || nestedInfoField.number.count === 1) {
    if (value === null) {
      empty = true;
    }
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
  infoValue: Value[] | Value[][];
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
            {<th></th>}
            <For each={props.infoField.nested.items}>
              {(infoFieldItem, i) => (
                <>
                  {isNonEmptyNestedInfoItem(props.infoField, i(), props.infoValue) && (
                    <FieldHeader field={infoFieldItem} vertical={true} />
                  )}
                </>
              )}
            </For>
          </thead>
          <tbody>
            {props.infoField.number.count === 1 ? (
              <tr>
                <For each={props.infoValue}>
                  {(value) => (
                    <>
                      {isNonEmptyNestedInfoItem(props.infoField, -1, props.infoValue) && (
                        <td>
                          <Info info={value} infoMetadata={props.infoField} />
                        </td>
                      )}
                    </>
                  )}
                </For>
              </tr>
            ) : (
              <For each={props.infoValue}>
                {(value, rowIndex) => (
                  <>
                    <tr>
                      <td>
                        <Show
                          when={props.sample == null}
                          fallback={
                            <Link
                              href={`/samples/${props.sample.id}/variants/${
                                props.variant.id
                              }/consequences/${rowIndex()}`}
                            >
                              <a class="button is-info is-small">
                                <span class="icon is-left">
                                  <i class="fa-solid fa-search" />
                                </span>
                              </a>
                            </Link>
                          }
                        >
                          <Link href={`/variants/${props.variant.id}/consequences/${rowIndex()}`}>
                            <a class="button is-info is-small">
                              <span class="icon is-left">
                                <i class="fa-solid fa-search" />
                              </span>
                            </a>
                          </Link>
                        </Show>
                      </td>
                      <For each={props.infoField.nested.items}>
                        {(infoFieldItem, i) => (
                          <>
                            {isNonEmptyNestedInfoItem(props.infoField, i(), props.infoValue) && (
                              <td>
                                <Info info={value[i()] as Value} infoMetadata={infoFieldItem} />
                              </td>
                            )}
                          </>
                        )}
                      </For>
                    </tr>
                  </>
                )}
              </For>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
