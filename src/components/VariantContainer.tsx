import { Component, createSignal, For, JSX, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../utils/api.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { GenomeBrowser } from "./GenomeBrowser.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { RecordsTable } from "./RecordsTable.tsx";
import { ConfigJson } from "../types/config";
import { VariantType } from "../utils/variantType.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { initConfig } from "../utils/config/config.ts";
import { A } from "@solidjs/router";
import { FieldValue, getInfoNestedField, getInfoValue, getInfoValueCount, ValueCategorical } from "../utils/vcf.ts";
import { href } from "../utils/utils.ts";

// Consequence fields shown as key facts, in this order, when the VCF has them.
const KEY_FIELDS: { id: string; label: string }[] = [
  { id: "Consequence", label: "Effect" },
  { id: "IMPACT", label: "Impact" },
  { id: "Feature", label: "Transcript" },
  { id: "EXON", label: "Exon" },
  { id: "INTRON", label: "Intron" },
  { id: "Existing_variation", label: "Known as" },
  { id: "gnomAD_AF", label: "gnomAD AF" },
  { id: "gnomAD_HN", label: "gnomAD homozygotes" },
  { id: "CAPICE_SC", label: "CAPICE score" },
  { id: "SpliceAI_pred_DS_AG", label: "SpliceAI acceptor gain" },
  { id: "SpliceAI_pred_DS_AL", label: "SpliceAI acceptor loss" },
  { id: "SpliceAI_pred_DS_DG", label: "SpliceAI donor gain" },
  { id: "SpliceAI_pred_DS_DL", label: "SpliceAI donor loss" },
  { id: "phyloP", label: "phyloP" },
  { id: "InheritanceModesGene", label: "Inheritance" },
  { id: "HPO", label: "Gene–phenotype (HPO)" },
  { id: "GADO_PD", label: "GADO" },
];

function isCategorical(value: unknown): value is NonNullable<ValueCategorical> {
  return typeof value === "object" && value !== null && "label" in value;
}

// Plain text for a VCF value: categories by label, lists joined, empty values as null.
export function displayValue(value: FieldValue | undefined): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) {
    const parts = (value as unknown[])
      .map((item) => displayValue(item as FieldValue))
      .filter((item): item is string => item !== null && item !== "");
    return parts.length > 0 ? parts.join(", ") : null;
  }
  if (isCategorical(value)) return value.label ?? null;
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(Number(value.toPrecision(4)));
  if (typeof value === "boolean") return value ? "yes" : null;
  if (typeof value === "object") return null;
  const text = String(value);
  if (text === "") return null;
  // long decimals stored as strings, e.g. phyloP "9.52000045776367"
  return /^-?\d+\.\d{5,}$/.test(text) ? String(Number(Number(text).toPrecision(4))) : text;
}

// Part after the "transcript:" prefix of an HGVS notation.
function shortHgvs(hgvs: string | null): string | null {
  return hgvs ? (hgvs.split(":").pop() ?? hgvs) : null;
}

const Section: Component<{ title: string; open?: boolean; children: JSX.Element }> = (props) => {
  // eslint-disable-next-line solid/reactivity -- initial state only
  const [open, setOpen] = createSignal(props.open ?? true);
  return (
    <div class="variant-card-section">
      <button
        type="button"
        class="variant-card-section-title"
        aria-expanded={open()}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <span class="chevron" classList={{ "is-open": open() }} />
        {props.title}
      </button>
      <Show when={open()}>
        <div class="variant-card-section-body">{props.children}</div>
      </Show>
    </div>
  );
};

export const VariantContainer: Component<{
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
  reportId: string;
}> = (props) => {
  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample, props.reportId);
  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);
  const [showEmpty, setShowEmpty] = createSignal(false);
  const toggleShowEmpty = () => setShowEmpty((isShow) => !isShow);

  const csqField = (id: string) => getInfoNestedField(props.metadata.records, "CSQ", id);
  const csqCount = () => {
    const field = csqField("Consequence") ?? csqField("Allele");
    return field ? getInfoValueCount(props.record, field) : 0;
  };
  const csqRaw = (id: string, index: number) => getInfoValue(props.record, index, csqField(id));
  // The consequence VEP picked, otherwise the first (consequences are listed most severe first).
  const picked = () => {
    for (let i = 0; i < csqCount(); i++) {
      if (csqRaw("PICK", i) === 1) return i;
    }
    return 0;
  };
  const csq = (id: string) => (csqCount() > 0 ? displayValue(csqRaw(id, picked())) : null);

  const variantId = () => {
    const data = props.record.data;
    const alts = data.a.map((alt) => alt ?? ".").join(",");
    return `${data.c}:${data.p} ${data.r}>${alts}`;
  };
  const vipC = (index: number) => {
    const value = csqRaw("VIPC", index);
    return isCategorical(value) ? (value as NonNullable<ValueCategorical>) : null;
  };
  const consequences = () => {
    const rows = [];
    for (let index = 0; index < csqCount(); index++) {
      rows.push({
        index,
        gene: displayValue(csqRaw("SYMBOL", index)),
        effect: displayValue(csqRaw("Consequence", index)),
        impact: displayValue(csqRaw("IMPACT", index)),
        transcript: displayValue(csqRaw("Feature", index)),
        hgvsc: shortHgvs(displayValue(csqRaw("HGVSc", index))),
        hgvsp: shortHgvs(displayValue(csqRaw("HGVSp", index))),
        vipC: vipC(index),
      });
    }
    return rows;
  };
  const consequenceHref = (index: number) => {
    const components: (string | number)[] = props.sample ? ["samples", props.sample.item.id] : [];
    return href([...components, "variants", props.variantType.id, "variant", props.record.id, "consequences", index]);
  };
  const keyFacts = () =>
    KEY_FIELDS.map((field) => ({ label: field.label, value: csq(field.id) })).filter((fact) => fact.value !== null);

  return (
    <section class="variant-card">
      <div class="variant-card-header">
        <div class="variant-card-identity">
          <div class="variant-card-id">{variantId()}</div>
          <Show when={csq("SYMBOL") || csq("HGVSc")}>
            <div class="variant-card-gene">
              <Show when={csq("SYMBOL")}>
                <em>{csq("SYMBOL")}</em>{" "}
              </Show>
              {shortHgvs(csq("HGVSc"))} {shortHgvs(csq("HGVSp"))}
            </div>
          </Show>
          <Show when={csq("clinVar_CLNSIG") || csq("VKGL_CL")}>
            <div class="variant-card-meta">
              {[
                csq("clinVar_CLNSIG") && `ClinVar: ${csq("clinVar_CLNSIG")}`,
                csq("VKGL_CL") && `VKGL: ${csq("VKGL_CL")}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </div>
          </Show>
        </div>
      </div>

      <Show when={csqCount() > 0}>
        <Section title={`Consequences (${csqCount()})`}>
          <div class="table-container">
            <table class="table is-narrow variant-card-consequences">
              <thead>
                <tr>
                  <th>Gene</th>
                  <th>Effect</th>
                  <th>Impact</th>
                  <th>Transcript</th>
                  <th>HGVS</th>
                  <th>VIP classification</th>
                  <th>
                    <span class="is-sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <For each={consequences()}>
                  {(consequence) => (
                    <tr>
                      <td>
                        <em>{consequence.gene}</em>
                      </td>
                      <td>{consequence.effect}</td>
                      <td>{consequence.impact}</td>
                      <td>{consequence.transcript}</td>
                      <td>{[consequence.hgvsc, consequence.hgvsp].filter(Boolean).join(" ")}</td>
                      <td>
                        <Show when={consequence.vipC}>{(vipC) => vipC().value}</Show>
                      </td>
                      <td class="row-action">
                        <A href={consequenceHref(consequence.index)}>
                          Details <span class="chevron" />
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Section>
      </Show>

      <Show when={keyFacts().length > 0}>
        <Section title={csqCount() > 1 ? `Key annotations (consequence ${picked() + 1})` : "Key annotations"}>
          <dl class="variant-card-facts">
            <For each={keyFacts()}>
              {(fact) => (
                <div>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              )}
            </For>
          </dl>
        </Section>
      </Show>

      <Show when={config().variant.samplesCells}>
        {(samplesCells) => (
          <Section title="Samples">
            <VariantGenotypeTable
              config={samplesCells()}
              samples={samples()}
              metadata={props.metadata}
              variantType={props.variantType}
              record={props.record}
            />
          </Section>
        )}
      </Show>

      <Section title="All consequence fields" open={false}>
        <RecordsTable fieldConfigs={config().variant.cells} records={[props.record]} verticalHeaders={true} />
      </Section>

      <Section title="Genome browser" open={true}>
        <GenomeBrowser metadata={props.metadata} samples={samples()} record={props.record} />
      </Section>

      <Section title="Record and INFO fields" open={false}>
        <div class="columns">
          <div class="column is-4">
            <VariantTable variant={props.record.data} />
          </div>
          <div class="column">
            <A href="#" onClick={toggleShowEmpty} class="small-blue-link">
              {showEmpty() ? "Hide empty fields" : "Show empty fields"}
            </A>
            <VariantInfoTable
              variantType={props.variantType}
              metadata={props.metadata}
              record={props.record}
              isShowEmpty={showEmpty()}
              reportId={props.reportId}
            />
          </div>
        </div>
      </Section>
    </section>
  );
};
