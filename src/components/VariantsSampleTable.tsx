import { Genotype, Metadata, Record } from "../api/vcf/Vcf";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Link } from "solid-app-router";
import { Item, Sample } from "../api/Api";
import { GenotypeField } from "./record/format/GenotypeField";
import { NestedInfoCollapsablePane } from "./NestedInfoCollapsablePane";
import { NestedInfoHeader } from "./NestedInfoHeader";
import { Component, For } from "solid-js";

export const VariantsSampleTable: Component<{
  sample: Sample;
  pedigreeSamples: Sample[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
}> = (props) => {
  const samples = [props.sample, ...props.pedigreeSamples];

  const nestedFields: string[] = [
    "Consequence",
    "SYMBOL",
    "InheritanceModesGene",
    "HGVSc",
    "HGVSp",
    "CAPICE_SC",
    "UMCG_CL",
    "VKGL_CL",
    "CLIN_SIG",
    "gnomAD_AF",
    "gnomAD_HN",
    "PUBMED",
  ];

  const nestedHeaders: string[] = [
    "Effect",
    "Gene",
    "Inheritance Modes",
    "HGVS C",
    "HGVS P",
    "CAPICE",
    "MVL",
    "VKGL",
    "ClinVar",
    "gnomAD AF",
    "gnomAD HN",
    "Pubmed",
  ];

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>Position</th>
              <th>Reference</th>
              <For each={samples}>{(sample) => <th>{sample.person.individualId}</th>}</For>
              <th />
              <NestedInfoHeader fields={nestedHeaders} />
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
                    <Ref value={record.data.r} />
                  </td>
                  <For each={samples}>
                    {(sample) => (
                      <td>
                        <GenotypeField
                          genotype={record.data.s[sample.index]["GT"] as Genotype}
                          refAllele={record.data.r}
                          altAlleles={record.data.a}
                        />
                      </td>
                    )}
                  </For>
                  <NestedInfoCollapsablePane
                    recordsMetadata={props.recordsMetadata}
                    fields={nestedFields}
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
