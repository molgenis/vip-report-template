import { Component, createResource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Loader } from "../components/Loader";
import {
  EMPTY_RECORDS_METADATA,
  EMPTY_SAMPLES,
  fetchDecisionTree,
  fetchPedigreeSamples,
  fetchRecordsMeta,
  toString,
} from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantSampleTable } from "../components/VariantSampleTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";
import { SampleVariantConsequenceRouteData } from "./data/SampleVariantConsequenceData";

export const SampleVariantConsequence: Component = () => {
  const { sample, variant, consequenceId } = useRouteData<SampleVariantConsequenceRouteData>();

  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples, { initialValue: EMPTY_SAMPLES });
  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [decisionTree] = createResource(fetchDecisionTree, { initialValue: null });

  return (
    <>
      {
        <Show
          when={
            !sample.loading &&
            !variant.loading &&
            !recordsMetadata.loading &&
            !pedigreeSamples.loading &&
            !decisionTree.loading
          }
          fallback={<Loader />}
        >
          <Breadcrumb
            items={[
              { href: "/samples", text: "Samples" },
              { href: `/samples/${sample().data.index}`, text: sample().data.person.individualId },
              { href: `/samples/${sample().data.index}/variants`, text: "Variants" },
              { href: `/samples/${sample().data.index}/variants/${variant().id}`, text: toString(variant()) },
              { text: `Consequence #${consequenceId}` },
            ]}
          />
          <div class="columns">
            <div class="column is-6">
              <h1 class="title is-5">Consequence</h1>
              <ConsequenceTable
                csqMetadata={recordsMetadata().info.CSQ.nested.items}
                csqValues={getSpecificConsequence(variant().data.n.CSQ, consequenceId)}
                record={variant().data}
              ></ConsequenceTable>
            </div>
            {decisionTree() !== null && (
              <div class="column">
                <h1 class="title is-5">Classification tree path</h1>
                <DecisionTreePath
                  decisionTree={decisionTree()}
                  path={getDecisionTreePath(recordsMetadata(), variant(), consequenceId)}
                />
              </div>
            )}
          </div>
          <div class="columns">
            <div class="column is-3">
              <h1 class="title is-5">Record</h1>
              <VariantTable variant={variant().data} />
            </div>
            <div class="column is-3">
              <h1 class="title is-5">Info</h1>
              <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
            </div>
            <div class="column">
              <h1 class="title is-5">Samples</h1>
              <VariantSampleTable
                formatFields={recordsMetadata().format}
                samples={[sample().data, ...pedigreeSamples()]}
                sampleValues={getRecordSamples(variant().data, sample().data, pedigreeSamples())}
                record={variant().data}
              />
            </div>
          </div>
        </Show>
      }
    </>
  );
};
