import { Genotype, Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Link } from "solid-app-router";
import { Item, Sample } from "../api/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { NestedInfoCollapsablePane } from "./NestedInfoCollapsablePane";
import { NestedInfoHeader } from "./NestedInfoHeader";
import { Component, createMemo, For } from "solid-js";

function createIndex(
  recordsMetadata: Metadata,
  nestedFields: { [key: string]: string }
): { headers: string[]; indices: number[] } {
  const headers: string[] = [];
  const indices: number[] = [];

  const infoFields = Object.values(recordsMetadata.info);

  const infoPositions = infoFields.map(function (infoField) {
    return infoField.id;
  });

  const infoFieldVepIdx = infoPositions.indexOf("CSQ");
  const vepField = infoFields[infoFieldVepIdx];

  if (vepField !== undefined && vepField.nested !== undefined) {
    const nestedVepItems = vepField.nested;
    const positions = nestedVepItems
      ? nestedVepItems.items.map(function (csqField) {
          return csqField.id;
        })
      : [];
    for (const nestedFieldsKey in nestedFields) {
      const index = positions.indexOf(nestedFieldsKey);
      if (index !== -1) {
        indices.push(index);
        headers.push(nestedFields[nestedFieldsKey]);
      }
    }
  }
  return { headers, indices };
}

export const VariantsSampleTable: Component<{
  sample: Sample;
  pedigreeSamples: Sample[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
  nestedFields: { [key: string]: string };
}> = (props) => {
  const samples = createMemo(() => [props.sample, ...props.pedigreeSamples]);
  const index = createMemo(() => createIndex(props.recordsMetadata, props.nestedFields));

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>Position</th>
              <th>Reference</th>
              <For each={samples()}>{(sample) => <th>{sample.person.individualId}</th>}</For>
              <th />
              <NestedInfoHeader fields={index().headers} />
            </tr>
          </thead>
          <tbody>
            <For each={props.records}>
              {(record) => (
                <tr>
                  <td>
                    <Link href={`/samples/${props.sample.index}/variants/${record.id}`}>
                      <Chrom value={record.data.c} />
                      <span>:</span>
                      <Pos value={record.data.p} />
                    </Link>
                  </td>
                  <td>
                    <Ref value={record.data.r} isAbbreviate={true} />
                  </td>
                  <For each={samples()}>
                    {(sample) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[sample.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                          isAbbreviate={true}
                        />
                      </td>
                    )}
                  </For>
                  <NestedInfoCollapsablePane
                    recordsMetadata={props.recordsMetadata}
                    indices={index().indices}
                    record={record}
                  />
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
