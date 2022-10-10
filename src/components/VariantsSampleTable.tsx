import { Genotype, Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Link } from "solid-app-router";
import { HtsFileMetadata, Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { InfoCollapsablePane } from "./InfoCollapsablePane";
import { Component, createMemo, createSignal, For, Show } from "solid-js";
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
  htsFileMeta: HtsFileMetadata;
}> = (props) => {
  const samples = createMemo(() => [props.item.data, ...props.pedigreeSamples.map((item) => item.data)]);

  const proband: Sample = props.item.data;
  const [father, setFather] = createSignal<Sample | undefined>(undefined);
  const [mother, setMother] = createSignal<Sample | undefined>(undefined);
  const otherFamilyMembers: Sample[] = [];

  samples().forEach((sample) => {
    if (proband.person.maternalId != "0" && sample.person.individualId === proband.person.maternalId) {
      setMother(sample);
    } else if (proband.person.paternalId != "0" && sample.person.individualId === proband.person.paternalId) {
      setFather(sample);
    } else if (sample.person.individualId !== proband.person.individualId) {
      otherFamilyMembers.push(sample);
    }
  });

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>Position</th>
              <th>Reference</th>
              <th>
                <Abbr
                  title={`${
                    proband.person.individualId
                  }: ${proband.person.sex.toLowerCase()}, ${proband.person.affectedStatus.toLowerCase()}`}
                  value="Proband"
                />
              </th>
              <Show when={mother() !== undefined && (mother() as Sample)} keyed>
                {(mother) => (
                  <th>
                    <Abbr
                      title={`${
                        mother.person.individualId
                      }: ${mother.person.sex.toLowerCase()}, ${mother.person.affectedStatus.toLowerCase()}`}
                      value="Mother"
                    />
                  </th>
                )}
              </Show>
              <Show when={father() !== undefined && (father() as Sample)} keyed>
                {(father) => (
                  <th>
                    <Abbr
                      title={`${
                        father.person.individualId
                      }: ${father.person.sex.toLowerCase()}, ${father.person.affectedStatus.toLowerCase()}`}
                      value="Father"
                    />
                  </th>
                )}
              </Show>
              <For each={otherFamilyMembers}>
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
                      <>
                        <td>
                          <GenotypeField
                            genotype={record.data.s[sample.index]["GT"] as Genotype}
                            refAllele={record.data.r}
                            altAlleles={record.data.a}
                            isAbbreviate={true}
                            allelicBalance={record.data.s[sample.index]["VIAB"] as number | undefined | null}
                            readDepth={record.data.s[sample.index]["DP"] as number | undefined}
                          />
                        </td>
                      </>
                    )}
                  </For>
                  <InfoCollapsablePane fields={props.nestedFields} record={record} htsFileMeta={props.htsFileMeta} />
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
