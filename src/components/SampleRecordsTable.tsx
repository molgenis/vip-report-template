import { Genotype, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { InfoCollapsablePane } from "./InfoCollapsablePane";
import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { FieldHeader } from "./FieldHeader";
import { Abbr } from "./Abbr";
import { abbreviateHeader } from "../utils/field";
import {
  getSampleAffectedStatusLabel,
  getSampleFamilyMembersWithoutParents,
  getSampleFather,
  getSampleLabel,
  getSampleMother,
  getSampleSexLabel,
} from "../utils/sample";
import { createFieldMap, FieldMap, MetadataContainer, SampleContainer } from "../utils/ApiUtils";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export type FieldId = string;

export interface Column {
  fieldId: FieldId;
}

export type NestedFieldId = string;

export interface NestedColumn extends Column {
  children: NestedFieldId[];
}

export type Columns = (Column | NestedColumn)[];

export const SampleRecordsTable: Component<{
  metadata: MetadataContainer;
  sample: SampleContainer;
  columns: Columns;
  records: Item<Record>[];
}> = (props) => {
  const samples = createMemo(() => [
    props.sample.item.data,
    ...props.sample.pedigreeSamples.map((pedigreeSample) => pedigreeSample.item.data),
  ]);
  const fieldMap = createMemo((): FieldMap => createFieldMap(props.metadata.records));

  const [proband, setProband] = createSignal<Sample | undefined>();
  const [father, setFather] = createSignal<Sample | undefined>();
  const [mother, setMother] = createSignal<Sample | undefined>();
  const [otherFamilyMembers, setOtherFamilyMembers] = createSignal<Sample[]>([]);

  onMount(() => {
    setProband(props.sample.item.data);
    setMother(getSampleMother(proband() as Sample, samples()));
    setFather(getSampleFather(proband() as Sample, samples()));
    setOtherFamilyMembers(getSampleFamilyMembersWithoutParents(proband() as Sample, samples()));
  });

  function getSampleHeaderDescription(sample: Sample): string {
    return `${getSampleLabel(sample)}: ${getSampleSexLabel(sample)}, ${getSampleAffectedStatusLabel(sample)}`;
  }

  const nestedFields = (): FieldMetadata[] => {
    const nestedColumn = props.columns[0] as NestedColumn; // FIXME
    return nestedColumn.children
      .map((childCol) => fieldMap()[nestedColumn.fieldId + "/" + childCol])
      .filter((field) => field !== null);
  };

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>Position</th>
              <th>Reference</th>
              <Show when={proband()} keyed>
                {(proband) => (
                  <th>
                    <Abbr title={getSampleHeaderDescription(proband)} value="Proband" />
                  </th>
                )}
              </Show>
              <Show when={mother()} keyed>
                {(mother) => (
                  <th>
                    <Abbr title={getSampleHeaderDescription(mother)} value="Mother" />
                  </th>
                )}
              </Show>
              <Show when={father()} keyed>
                {(father) => (
                  <th>
                    <Abbr title={getSampleHeaderDescription(father)} value="Father" />
                  </th>
                )}
              </Show>
              <For each={otherFamilyMembers()}>
                {(sample: Sample) => (
                  <th>
                    <Abbr title={getSampleHeaderDescription(sample)} value={abbreviateHeader(getSampleLabel(sample))} />
                  </th>
                )}
              </For>
              {/* column containing collapse/expand icon */}
              <th />
              <For each={nestedFields()}>{(field) => <FieldHeader field={field} />}</For>
            </tr>
          </thead>
          <tbody>
            <For each={props.records}>
              {(record) => (
                <tr>
                  <td>
                    <A href={`/samples/${props.sample.item.id}/variant/${record.id}`}>
                      <Chrom value={record.data.c} />
                      <span>:</span>
                      <Pos value={record.data.p} />
                    </A>
                  </td>
                  <td>
                    <Ref value={record.data.r} isAbbreviate={true} />
                  </td>
                  <Show when={proband()} keyed>
                    {(proband) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[proband.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                          isAbbreviate={true}
                          allelicBalance={record.data.s[proband.index]["VIAB"] as number | undefined | null}
                          readDepth={record.data.s[proband.index]["DP"] as number | undefined}
                        />
                      </td>
                    )}
                  </Show>
                  <Show when={mother()} keyed>
                    {(mother) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[mother.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                          isAbbreviate={true}
                          allelicBalance={record.data.s[mother.index]["VIAB"] as number | undefined | null}
                          readDepth={record.data.s[mother.index]["DP"] as number | undefined}
                        />
                      </td>
                    )}
                  </Show>
                  <Show when={father()} keyed>
                    {(father) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[father.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                          isAbbreviate={true}
                          allelicBalance={record.data.s[father.index]["VIAB"] as number | undefined | null}
                          readDepth={record.data.s[father.index]["DP"] as number | undefined}
                        />
                      </td>
                    )}
                  </Show>
                  <For each={otherFamilyMembers()}>
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
                  <Show when={proband()} keyed>
                    {(proband) => (
                      <InfoCollapsablePane
                        fields={nestedFields()}
                        record={record}
                        htsFileMeta={props.metadata.htsFile}
                        isPossibleCompound={
                          record.data.s[proband.index]["VIC"] !== null &&
                          record.data.s[proband.index]["VIC"] !== undefined
                        }
                      />
                    )}
                  </Show>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
