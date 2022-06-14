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
import { abbreviateHeader } from "../utils/field";

export const VariantsSampleTable: Component<{
  item: Item<Sample>;
  pedigreeSamples: Item<Sample>[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
  nestedFields: FieldMetadata[];
}> = (props) => {
  const samples = createMemo(() => [props.item.data, ...props.pedigreeSamples.map((item) => item.data)]);

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
                {(sample: Sample) => (
                  <th>
                    <Abbr
                      title={`${
                        sample.person.individualId
                      }: ${sample.person.sex.toLowerCase()}, ${sample.person.affectedStatus.toLowerCase()}`}
                      value={abbreviateHeader(sample.person.individualId)}
                    />
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
                    <Link href={`/samples/${props.item.id}/variants/${record.id}`}>
                      <Chrom value={record.data.c} />
                      <span>:</span>
                      <Pos value={record.data.p} />
                    </Link>
                  </td>
                  <td>
                    <Ref value={record.data.r} isAbbreviate={true} />
                  </td>
                  <For each={samples()}>
                    {(sample: Sample) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[sample.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                          isAbbreviate={true}
                          allelicDepth={record.data.s[sample.index]["AD"] as number[]}
                          readDepth={record.data.s[sample.index]["DP"] as number}
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
