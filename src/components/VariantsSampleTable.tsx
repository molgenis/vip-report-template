import { Genotype, Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Link } from "solid-app-router";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { InfoCollapsablePane } from "./InfoCollapsablePane";
import { Component, createMemo, For } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FieldHeader } from "./FieldHeader";
import { Abbr } from "./Abbr";

function getSampleName(individualId: string) {
  if (individualId.length > 10) {
    return individualId.slice(0, 8) + "...";
  }
  return individualId;
}

export const VariantsSampleTable: Component<{
  sample: Sample;
  pedigreeSamples: Sample[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
  nestedFields: FieldMetadata[];
}> = (props) => {
  const samples = createMemo(() => [props.sample, ...props.pedigreeSamples]);

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>Position</th>
              <th>Reference</th>
              <For each={samples()}>
                {(sample) => (
                  <th>
                    <Abbr
                      title={`${
                        sample.person.individualId
                      }: ${sample.person.sex.toLowerCase()}, ${sample.person.affectedStatus.toLowerCase()}`}
                      value={getSampleName(sample.person.individualId)}
                    ></Abbr>
                  </th>
                )}
              </For>
              {/* column containing collapse/expand icon */}
              <th />
              <For each={props.nestedFields}>{(field) => <FieldHeader field={field} />}</For>
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
                  <InfoCollapsablePane fields={props.nestedFields} record={record} />
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
