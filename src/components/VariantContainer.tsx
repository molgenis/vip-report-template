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

// VIP classification codes to badge styles (see _theme.scss .class-badge--*)
const CLASS_BADGE: Record<string, string> = {
  P: "pathogenic",
  LP: "likely-pathogenic",
  VUS: "uncertain",
  LB: "likely-benign",
  B: "benign",
};

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
  const vipC = () => {
    const value = csqCount() > 0 ? csqRaw("VIPC", picked()) : undefined;
    return isCategorical(value) ? (value as NonNullable<ValueCategorical>) : null;
  };
  const consequenceHref = () => {
    const components: (string | number)[] = props.sample ? ["samples", props.sample.item.id] : [];
    return href([
      ...components,
      "variants",
      props.variantType.id,
      "variant",
      props.record.id,
      "consequences",
      picked(),
    ]);
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
          <div class="variant-card-meta">
            {[csq("Consequence"), csq("IMPACT") && `${csq("IMPACT")} impact`, csq("Feature")]
              .filter(Boolean)
              .join(" · ")}
            <Show when={csqCount() > 1}>{` · consequence ${picked() + 1} of ${csqCount()}`}</Show>
          </div>
        </div>
        <div class="variant-card-verdict">
          <Show when={vipC()}>
            {(vipC) => (
              <A
                href={consequenceHref()}
                class={`class-badge class-badge--${CLASS_BADGE[vipC().value ?? ""] ?? "other"}`}
                title="VIP classification of this consequence; open to see the decision tree path"
              >
                {vipC().label}
              </A>
            )}
          </Show>
          <Show when={csq("clinVar_CLNSIG")}>
            <span class="variant-card-aside">ClinVar: {csq("clinVar_CLNSIG")}</span>
          </Show>
          <Show when={csq("VKGL_CL")}>
            <span class="variant-card-aside">VKGL: {csq("VKGL_CL")}</span>
          </Show>
        </div>
      </div>

      <Show when={keyFacts().length > 0}>
        <Section title="Key annotations">
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

      <Section title={`Consequences (${csqCount() || 1})`} open={false}>
        <RecordsTable fieldConfigs={config().variant.cells} records={[props.record]} verticalHeaders={true} />
      </Section>

      <Section title="Genome browser" open={false}>
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
