import { Component, createSignal, For, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../utils/api.ts";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { DecisionTree, Item, Sample } from "@molgenis/vip-report-api";
import { VariantTable } from "./VariantTable.tsx";
import { DecisionTreePath } from "./tree/DecisionTreePath.tsx";
import { getDecisionTreePath, getSampleTreePath } from "../utils/decisionTree.ts";
import { VariantType } from "../utils/variantType.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { ConfigJson } from "../types/config";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { initConfig } from "../utils/config/config.ts";
import { initConfigCells } from "../utils/config/configCells.ts";
import { ConfigCellInfo } from "../types/configCells";
import { A } from "@solidjs/router";
import { getInfoNestedField, getInfoValue, getInfoValueCount } from "../utils/vcf.ts";
import { href } from "../utils/utils.ts";
import { displayValue } from "./VariantContainer.tsx";
import { AnnotationGroup, groupConsequenceFields } from "./ConsequenceAnnotations.tsx";

// Part after the "transcript:" prefix of an HGVS notation.
function shortHgvs(hgvs: string | null): string | null {
  return hgvs ? (hgvs.split(":").pop() ?? hgvs) : null;
}

// Consequence page: why VIP classified this consequence the way it did, then all of its annotations by subject.
export const VariantConsequenceContainer: Component<{
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  consequenceId: number;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
  decisionTree: DecisionTree | null;
  sampleTree: DecisionTree | null;
  reportId: string;
}> = (props) => {
  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample, props.reportId);

  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);
  const hasDecisionTreePathMeta = () =>
    Object.values(props.metadata.records.info["CSQ"]?.nested?.items || {}).some((csq) => csq.id === "VIPP");
  const hasSampleTreePathMeta = () => props.metadata.records.format["VIPP_S"] != null;
  const showSampleTree = () => {
    if (props.sample) {
      const treePath = getSampleTreePath(props.metadata.records, props.sample, props.record, props.consequenceId);
      return treePath !== undefined && treePath.length > 0;
    }
    return false;
  };
  const showVariantTree = () => props.decisionTree !== null && hasDecisionTreePathMeta();
  const [showEmpty, setShowEmpty] = createSignal(false);

  const csqField = (id: string) => getInfoNestedField(props.metadata.records, "CSQ", id);
  const csq = (id: string) => displayValue(getInfoValue(props.record, props.consequenceId, csqField(id)));
  const csqCount = () => {
    const field = csqField("Consequence") ?? csqField("Allele");
    return field ? getInfoValueCount(props.record, field) : 0;
  };
  const variantHref = (...parts: (string | number)[]) =>
    href([
      ...(props.sample ? ["samples", props.sample.item.id] : []),
      "variants",
      props.variantType.id,
      "variant",
      props.record.id,
      ...parts,
    ]);
  const variantId = () => {
    const data = props.record.data;
    return `${data.c}:${data.p} ${data.r}>${data.a.map((alt) => alt ?? ".").join(",")}`;
  };

  const csqFields = () =>
    initConfigCells([{ type: "info", name: "CSQ/.*" }], props.variantType, props.metadata, null, props.reportId).filter(
      (configCell) => configCell.type !== "group",
    ) as ConfigCellInfo[];
  const infoFields = () =>
    initConfigCells(
      [{ type: "info", name: "((?!CSQ).)*" }],
      props.variantType,
      props.metadata,
      null,
      props.reportId,
    ).filter((configCell) => configCell.type !== "group") as ConfigCellInfo[];

  return (
    <div class="consequence-page">
      <header class="consequence-header">
        <div>
          <div class="variant-card-id">{variantId()}</div>
          <div class="variant-card-gene">
            <Show when={csq("SYMBOL")}>
              <em>{csq("SYMBOL")}</em>{" "}
            </Show>
            {[shortHgvs(csq("HGVSc")), shortHgvs(csq("HGVSp"))].filter(Boolean).join(" ")}
          </div>
          <div class="variant-card-meta">
            {[csq("Consequence"), csq("IMPACT") && `${csq("IMPACT")} impact`, csq("Feature")]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
        <nav class="consequence-nav">
          <Show when={csqCount() > 1}>
            <Show when={props.consequenceId > 0} fallback={<span class="is-disabled">‹ Previous</span>}>
              <A href={variantHref("consequences", props.consequenceId - 1)}>‹ Previous</A>
            </Show>
            <span>
              Consequence {props.consequenceId + 1} of {csqCount()}
            </span>
            <Show when={props.consequenceId < csqCount() - 1} fallback={<span class="is-disabled">Next ›</span>}>
              <A href={variantHref("consequences", props.consequenceId + 1)}>Next ›</A>
            </Show>
          </Show>
          <A href={variantHref()}>All consequences</A>
        </nav>
      </header>

      <Show when={showVariantTree() || showSampleTree()}>
        <section class="consequence-section">
          <h2 class="consequence-section-title">Why this classification</h2>
          <div class="consequence-flows" classList={{ "is-pair": showVariantTree() && showSampleTree() }}>
            <Show when={showVariantTree() && props.decisionTree}>
              {(decisionTree) => (
                <div>
                  <h3 class="annotation-group-title">Variant classification</h3>
                  <DecisionTreePath
                    decisionTree={decisionTree()}
                    path={getDecisionTreePath(props.metadata.records, props.record, props.consequenceId)}
                  />
                </div>
              )}
            </Show>
            <Show when={showSampleTree() && hasSampleTreePathMeta() && props.sampleTree && props.sample}>
              {(sample) => (
                <div>
                  <h3 class="annotation-group-title">Sample classification</h3>
                  <DecisionTreePath
                    decisionTree={props.sampleTree!}
                    path={getSampleTreePath(props.metadata.records, sample(), props.record, props.consequenceId)}
                  />
                </div>
              )}
            </Show>
          </div>
        </section>
      </Show>

      <Show when={config().variant.samplesCells}>
        {(samplesCells) => (
          <section class="consequence-section">
            <h2 class="consequence-section-title">Samples</h2>
            <VariantGenotypeTable
              config={samplesCells()}
              samples={samples()}
              metadata={props.metadata}
              variantType={props.variantType}
              record={props.record}
            />
          </section>
        )}
      </Show>

      <section class="consequence-section">
        <div class="consequence-section-header">
          <h2 class="consequence-section-title">Annotations</h2>
          <button type="button" class="decision-flow-rule-toggle" onClick={() => setShowEmpty((show) => !show)}>
            {showEmpty() ? "Hide empty fields" : "Show empty fields"}
          </button>
        </div>
        <div class="annotation-groups">
          <For each={groupConsequenceFields(csqFields())}>
            {(group) => (
              <AnnotationGroup
                title={group.title}
                fields={group.fields}
                record={props.record}
                valueIndex={props.consequenceId}
                isShowEmpty={showEmpty()}
              />
            )}
          </For>
          <AnnotationGroup
            title="Variant (INFO)"
            fields={infoFields()}
            record={props.record}
            valueIndex={null}
            isShowEmpty={showEmpty()}
          />
          <section class="annotation-group">
            <h3 class="annotation-group-title">Record</h3>
            <VariantTable variant={props.record.data} />
          </section>
        </div>
      </section>
    </div>
  );
};
