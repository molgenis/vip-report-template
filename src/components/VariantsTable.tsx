import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Component, createMemo, For } from "solid-js";
import { A } from "@solidjs/router";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Id } from "./record/Id";
import { Alt } from "./record/Alt";
import { Qual } from "./record/Qual";
import { Filter } from "./record/Filter";
import { Info } from "./record/Info";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { HtsFileMetadata, Item } from "@molgenis/vip-report-api/src/Api";
import { FieldHeader } from "./FieldHeader";
import { InfoCollapsablePane } from "./InfoCollapsablePane";

const computeRowspan = (recordsMetadata: Metadata) =>
  Object.values(recordsMetadata.info).find((field) => field.nested) !== undefined ? 2 : 1;
// '+1' for the column with the collapse button
const computeColspan = (field: FieldMetadata) => (field.nested ? field.nested.items.length + 1 : undefined);

export const VariantsTable: Component<{
  records: Item<Record>[];
  recordsMetadata: Metadata;
  htsFileMeta: HtsFileMetadata;
}> = (props) => {
  const infoFields = () => Object.values(props.recordsMetadata.info);
  const infoFieldsNested = () => infoFields().filter((infoField) => infoField.nested);

  const rowspan = createMemo(() => computeRowspan(props.recordsMetadata));

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th rowspan={rowspan()}>CHROM</th>
              <th rowspan={rowspan()}>POS</th>
              <th rowspan={rowspan()}>ID</th>
              <th rowspan={rowspan()}>REF</th>
              <th rowspan={rowspan()}>ALT</th>
              <th rowspan={rowspan()}>QUAL</th>
              <th rowspan={rowspan()}>FILTER</th>
              <For each={infoFields()}>
                {(infoField) => (
                  <FieldHeader
                    field={infoField}
                    rowspan={infoField.nested ? undefined : rowspan()}
                    colspan={computeColspan(infoField)}
                  />
                )}
              </For>
            </tr>
            {rowspan() && rowspan() > 1 && (
              <tr>
                <For each={infoFieldsNested()}>
                  {(infoField) => (
                    <>
                      {infoField.number.count !== 1 && <th />}
                      <For each={infoField.nested?.items}>
                        {(nestedInfoField) => <FieldHeader field={nestedInfoField} />}
                      </For>
                    </>
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
                    <A href={`/variants/${record.id}`}>
                      <Pos value={record.data.p} />
                    </A>
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
                  <For each={infoFields()}>
                    {(infoField) =>
                      infoField.nested ? (
                        <InfoCollapsablePane
                          fields={infoField.nested.items}
                          record={record}
                          htsFileMeta={props.htsFileMeta}
                        />
                      ) : (
                        <td>
                          <Info
                            info={{ value: record.data.n[infoField.id], record: record }}
                            infoMeta={infoField}
                            context={props.htsFileMeta}
                          />
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
