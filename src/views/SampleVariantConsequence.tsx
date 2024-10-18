import { Component, createResource, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantSampleTable } from "../components/VariantSampleTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath, getSampleTreePath } from "../utils/decisionTreeUtils";
import { getSampleContainerLabel } from "../utils/sample";
import { DecisionTree, Item } from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getMetadata, getRecordById, getSampleById } from "./data/data";
import { fetchDecisionTree, fetchSampleTree, SampleContainer } from "../Api.ts";
import { getRecordLabel } from "../utils/utils.ts";

export const SampleVariantConsequenceView: Component<RouteSectionProps> = (props) => {
  const consequenceId = () => Number(props.params.consequenceId);

  const metadata = createAsync(() => getMetadata());
  const sample = createAsync(() => getSampleById(props.params.sampleId));
  const variant = createAsync(() => getRecordById(props.params.variantId));

  const [decisionTree] = createResource(fetchDecisionTree, { initialValue: null });
  const [sampleTree] = createResource(fetchSampleTree, { initialValue: null });

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <Show when={variant()} fallback={<Loader />}>
          {(variant) => (
            <>
              <Breadcrumb
                items={[
                  { href: "/samples", text: "Samples" },
                  { href: `/samples/${sample().item.id}`, text: getSampleContainerLabel(sample()) },
                  { href: `/samples/${sample().item.id}/variants`, text: "Variants" },
                  {
                    href: `/samples/${sample().item.id}/variant/${variant().id}`,
                    text: getRecordLabel(variant()),
                  },
                  { text: `Consequence #${consequenceId()}` },
                ]}
              />
              <Show when={metadata()} fallback={<Loader />}>
                {(metadata) => (
                  <SampleVariantConsequence
                    sample={sample()}
                    recordsMeta={metadata().records}
                    variant={variant()}
                    consequenceId={consequenceId()}
                    decisionTree={decisionTree()}
                    sampleTree={sampleTree()}
                  />
                )}
              </Show>
            </>
          )}
        </Show>
      )}
    </Show>
  );
};

export const SampleVariantConsequence: Component<{
  sample: SampleContainer;
  recordsMeta: Metadata;
  variant: Item<Record>;
  consequenceId: number;
  decisionTree: DecisionTree | null;
  sampleTree: DecisionTree | null;
}> = (props) => {
  const hasDecisionTreePathMeta = () =>
    (props.recordsMeta.info.CSQ?.nested?.items || []).findIndex((csq) => csq.id === "VIPP") !== -1;
  const hasSampleTreePathMeta = () => props.recordsMeta.format.VIPP_S != null;

  return (
    <>
      <div class="columns">
        <div class="column is-4">
          <div>
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoFields={props.recordsMeta.info} record={props.variant} />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Consequence</h1>
            <ConsequenceTable
              csqMetadata={
                props.recordsMeta.info.CSQ.nested !== undefined ? props.recordsMeta.info.CSQ.nested.items : []
              }
              csqValues={getSpecificConsequence(props.variant.data.n.CSQ as ValueArray, props.consequenceId)}
              record={props.variant}
            />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={props.variant.data} />
          </div>
        </div>
        <div class="column is-8">
          <div>
            <h1 class="title is-5">Samples</h1>
            <VariantSampleTable
              formatFields={props.recordsMeta.format}
              samples={[props.sample.data, ...props.pedigreeSamples.map((item) => item.data)]}
              sampleValues={getRecordSamples(
                props.variant.data,
                props.sample.data,
                props.pedigreeSamples.map((item) => item.data),
              )}
              record={props.variant}
            />
          </div>
          <div class="columns mt-3">
            {props.decisionTree !== null && hasDecisionTreePathMeta() && (
              <div class="column is-6">
                <h1 class="title is-5">Variant classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.decisionTree}
                  path={getDecisionTreePath(props.recordsMeta, props.variant, props.consequenceId)}
                />
              </div>
            )}
            {props.sampleTree !== null && hasSampleTreePathMeta() && (
              <div class="column is-6">
                <h1 class="title is-5">Sample classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.sampleTree}
                  path={getSampleTreePath(
                    props.recordsMeta,
                    props.sample.data.index,
                    props.variant,
                    props.consequenceId,
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
