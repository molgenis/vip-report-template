import { Metadata, Record } from "../api/vcf/Vcf";
import { Component, For } from "solid-js";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Id } from "./record/Id";
import { Alt } from "./record/Alt";
import { Qual } from "./record/Qual";
import { Filter } from "./record/Filter";
import { Info } from "./record/Info";
import { Value } from "../api/vcf/ValueParser";
import { FieldMetadata } from "../api/vcf/MetadataParser";
import { Link } from "solid-app-router";
import { Item } from "../api/Api";

const computeRowspan = (recordsMetadata: Metadata) =>
  Object.values(recordsMetadata.info).find((field) => field.nested) !== undefined ? 2 : undefined;
const computeColspan = (field: FieldMetadata) => (field.nested ? field.nested.items.length : undefined);

export const VariantsTable: Component<{
  records: Item<Record>[];
  recordsMetadata: Metadata;
}> = (props) => {
  const infoFields = Object.values(props.recordsMetadata.info);
  const infoFieldsNested = infoFields.filter((infoField) => infoField.nested);

  const rowspan = computeRowspan(props.recordsMetadata);

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th rowspan={rowspan}>CHROM</th>
              <th rowspan={rowspan}>POS</th>
              <th rowspan={rowspan}>ID</th>
              <th rowspan={rowspan}>REF</th>
              <th rowspan={rowspan}>ALT</th>
              <th rowspan={rowspan}>QUAL</th>
              <th rowspan={rowspan}>FILTER</th>
              <For each={infoFields}>
                {(infoField) => (
                  <th rowspan={infoField.nested ? undefined : rowspan} colspan={computeColspan(infoField)}>
                    {infoField.id}
                  </th>
                )}
              </For>
            </tr>
            {rowspan && rowspan > 1 && (
              <tr>
                <For each={infoFieldsNested}>
                  {(infoField) => (
                    <For each={infoField.nested?.items}>{(nestedInfoField) => <th>{nestedInfoField.id}</th>}</For>
                  )}
                </For>
              </tr>
            )}
          </thead>
          <tbody>
            <For each={props.records}>
              {(record) => (
                <tr>
                  <td>
                    <Chrom value={record.data.c} />
                  </td>
                  <td>
                    <Link href={`/variants/${record.id}`}>
                      <Pos value={record.data.p} />
                    </Link>
                  </td>
                  <td>
                    <Id value={record.data.i} />
                  </td>
                  <td>
                    <Ref value={record.data.r} isAbbreviate={true} />
                  </td>
                  <td>
                    <Alt value={record.data.a} isAbbreviate={true} />
                  </td>
                  <td>
                    <Qual value={record.data.q} />
                  </td>
                  <td>
                    <Filter value={record.data.f} />
                  </td>
                  <For each={infoFields}>
                    {(infoField) =>
                      infoField.nested ? (
                        <For each={infoField.nested.items}>
                          {(infoFieldNested, i) => (
                            <td>
                              {infoField.number.count === 1 ? (
                                <span>TODO</span>
                              ) : (
                                <For each={record.data.n[infoField.id] as unknown as Value[][]}>
                                  {(value, j) => (
                                    <>
                                      {j() !== 0 && <br />}
                                      <Info info={value[i()]} infoMetadata={infoFieldNested} />
                                    </>
                                  )}
                                </For>
                              )}
                            </td>
                          )}
                        </For>
                      ) : (
                        <td>
                          <Info info={record.data.n[infoField.id]} infoMetadata={infoField} />
                        </td>
                      )
                    }
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
