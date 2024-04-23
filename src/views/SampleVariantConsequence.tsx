import { Component, createResource, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { fetchDecisionTree, fetchPedigreeSamples, fetchRecordsMeta, getRecordLabel } from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantSampleTable } from "../components/VariantSampleTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";
import { getSampleLabel } from "../utils/sample";
import { DecisionTree, Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getSample, getVariant } from "./data/data";

export const SampleVariantConsequenceView: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSample(Number(props.params.sampleId)));
  const variant = createAsync(() => getVariant(Number(props.params.variantId)));
  const consequenceId = () => Number(props.params.consequenceId);

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [decisionTree] = createResource(fetchDecisionTree, { initialValue: null });

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <Show when={variant()} fallback={<Loader />}>
          {(variant) => (
            <>
              <Breadcrumb
                items={[
                  { href: "/samples", text: "Samples" },
                  { href: `/samples/${sample().id}`, text: getSampleLabel(sample().data) },
                  { href: `/samples/${sample().id}/variants`, text: "Variants" },
                  {
                    href: `/samples/${sample().id}/variants/${variant().id}`,
                    text: getRecordLabel(variant()),
                  },
                  { text: `Consequence #${consequenceId.toString()}` },
                ]}
              />
              <Show when={pedigreeSamples()} fallback={<Loader />}>
                {(pedigreeSamples) => (
                  <Show when={recordsMeta()} fallback={<Loader />}>
                    {(recordsMeta) => (
                      <SampleVariantConsequence
                        sample={sample()}
                        pedigreeSamples={pedigreeSamples().items}
                        recordsMeta={recordsMeta()}
                        variant={variant()}
                        consequenceId={consequenceId()}
                        decisionTree={decisionTree()}
                      />
                    )}
                  </Show>
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
  sample: Item<Sample>;
  pedigreeSamples: Item<Sample>[];
  recordsMeta: Metadata;
  variant: Item<Record>;
  consequenceId: number;
  decisionTree: DecisionTree | null;
}> = (props) => {
  const hasDecisionTreePathMeta = () =>
    (props.recordsMeta.info.CSQ?.nested?.items || []).findIndex((csq) => csq.id === "VIPP") !== -1;

  return (
    <>
      <div class="columns">
        <div class="column is-6">
          <h1 class="title is-5">Consequence</h1>
          <ConsequenceTable
            csqMetadata={props.recordsMeta.info.CSQ.nested !== undefined ? props.recordsMeta.info.CSQ.nested.items : []}
            csqValues={getSpecificConsequence(props.variant.data.n.CSQ as ValueArray, props.consequenceId)}
            record={props.variant}
          />
        </div>
        {props.decisionTree !== null && hasDecisionTreePathMeta() && (
          <div class="column">
            <h1 class="title is-5">Classification tree path</h1>
            <DecisionTreePath
              decisionTree={props.decisionTree}
              path={getDecisionTreePath(props.recordsMeta, props.variant, props.consequenceId)}
            />
          </div>
        )}
      </div>
      <div class="columns">
        <div class="column is-3">
          <h1 class="title is-5">Record</h1>
          <VariantTable variant={props.variant.data} />
        </div>
        <div class="column is-3">
          <h1 class="title is-5">Info</h1>
          <VariantInfoTable infoFields={props.recordsMeta.info} record={props.variant} />
        </div>
        <div class="column">
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
      </div>
    </>
  );
};
