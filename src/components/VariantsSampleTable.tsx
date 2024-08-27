import { Genotype, Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { HtsFileMetadata, Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { InfoCollapsablePane } from "./InfoCollapsablePane";
import { Component, createMemo, createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import { A } from "@solidjs/router";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
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
import { Info } from "./record/Info";
import { Format } from "./record/Format";

export const VariantsSampleTable: Component<{
  item: Item<Sample>;
  pedigreeSamples: Item<Sample>[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
  nestedFields: FieldMetadata[];
  htsFileMeta: HtsFileMetadata;
}> = (props) => {
  const samples = createMemo(() => [props.item.data, ...props.pedigreeSamples.map((item) => item.data)]);

  const [proband, setProband] = createSignal<Sample | undefined>();
  const [father, setFather] = createSignal<Sample | undefined>();
  const [mother, setMother] = createSignal<Sample | undefined>();
  const [otherFamilyMembers, setOtherFamilyMembers] = createSignal<Sample[]>([]);

  onMount(() => {
    setProband(props.item.data);
    setMother(getSampleMother(proband() as Sample, samples()));
    setFather(getSampleFather(proband() as Sample, samples()));
    setOtherFamilyMembers(getSampleFamilyMembersWithoutParents(proband() as Sample, samples()));
  });

  function getSampleHeaderDescription(sample: Sample): string {
    return `${getSampleLabel(sample)}: ${getSampleSexLabel(sample)}, ${getSampleAffectedStatusLabel(sample)}`;
  }

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow alternating">
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
              <th colSpan={props.nestedFields.length + 1}>Information</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.records}>
              {(record) => (
                <tr>
                  <td>
                    <A href={`/samples/${props.item.id}/variants/${record.id}`}>
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
                        <Switch fallback={<td>Huh?</td>}>
                          <Match when={record.data.n["SVTYPE"] !== "STR"}>
                            <GenotypeField
                              genotype={record.data.s[proband.index]["GT"] as Genotype}
                              refAllele={record.data.r}
                              altAlleles={record.data.a}
                              isAbbreviate={true}
                              allelicBalance={record.data.s[proband.index]["VIAB"] as number | undefined | null}
                              readDepth={record.data.s[proband.index]["DP"] as number | undefined}
                            />
                          </Match>
                          <Match when={record.data.n["SVTYPE"] === "STR"}>
                            <Format
                              format={record.data.s[proband.index]["AC"]}
                              formatMetadata={props.recordsMetadata.format["AC"]}
                              record={record}
                              isAbbreviate={false}
                              allelicBalance={record.data.s[proband.index]["VIAB"] as number | undefined | null}
                              readDepth={record.data.s[proband.index]["DP"] as number | undefined}
                            />
                          </Match>
                        </Switch>
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
                  <Switch fallback={<td>Huh?</td>}>
                    <Match when={record.data.n["SVTYPE"] !== "STR"}>
                      <Show when={proband()} keyed>
                        {(proband) => (
                          <td>
                            <InfoCollapsablePane
                              fields={props.nestedFields}
                              record={record}
                              htsFileMeta={props.htsFileMeta}
                              isPossibleCompound={
                                record.data.s[proband.index]["VIC"] !== null &&
                                record.data.s[proband.index]["VIC"] !== undefined
                              }
                            />
                          </td>
                        )}
                      </Show>
                    </Match>
                    <Match when={record.data.n["SVTYPE"] === "STR"}>
                      <td>
                        <div class="columns">
                          <div class="column is-one-third">
                            <b>Gene ID: </b>
                            <Info
                              info={{ value: record.data.n["Gene_id"], record: record }}
                              infoMeta={props.recordsMetadata.info["Gene_id"]}
                              context={{}}
                            />
                            <br />
                            <b>Normal maximum: </b>
                            <Info
                              info={{ value: record.data.n["NormalMax"], record: record }}
                              infoMeta={props.recordsMetadata.info["NormalMax"]}
                              context={{}}
                            />
                          </div>
                          <div class="column is-one-third">
                            <b>Locus ID: </b>
                            <Info
                              info={{ value: record.data.n["Repeat_id"], record: record }}
                              infoMeta={props.recordsMetadata.info["Repeat_id"]}
                              context={{}}
                            />
                            <br />
                            <b>Pathogenic minimum: </b>
                            <Info
                              info={{ value: record.data.n["PathogenicMin"], record: record }}
                              infoMeta={props.recordsMetadata.info["PathogenicMin"]}
                              context={{}}
                            />
                          </div>
                          <div class="column is-one-third">
                            <b>Disease: </b>
                            <Info
                              info={{ value: record.data.n["Disease"], record: record }}
                              infoMeta={props.recordsMetadata.info["Disease"]}
                              context={{}}
                            />
                            <br />
                            <b>Called repeat / catalog repeat: </b>
                            <Info
                              info={{ value: record.data.n["RU"], record: record }}
                              infoMeta={props.recordsMetadata.info["RU"]}
                              context={{}}
                            />{" "}
                            /{" "}
                            <Info
                              info={{ value: record.data.n["repeat_unit"], record: record }}
                              infoMeta={props.recordsMetadata.info["repeat_unit"]}
                              context={{}}
                            />
                          </div>
                        </div>
                      </td>
                    </Match>
                  </Switch>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
