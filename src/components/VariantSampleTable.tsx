import { Genotype, Metadata, Record } from "../api/vcf/Vcf";
import { Component, For } from "solid-js";
import { Ref } from "./record/Ref";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Link } from "solid-app-router";
import { Item, Sample } from "../api/Api";
import { GenotypeField } from "./record/format/GenotypeField";

export const VariantSampleTable: Component<{
  sample: Sample;
  pedigreeSamples: Sample[];
  records: Item<Record>[];
  recordsMetadata: Metadata;
}> = (props) => {
  const samples = [props.sample, ...props.pedigreeSamples];

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
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
