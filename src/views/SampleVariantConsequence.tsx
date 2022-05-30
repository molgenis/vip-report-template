import { Component, createResource, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import {
  EMPTY_RECORDS_METADATA,
  EMPTY_SAMPLES,
  fetchDecisionTree,
  fetchPedigreeSamples,
  fetchRecordsMeta,
} from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantSampleTable } from "../components/VariantSampleTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { getConsequenceLabel, getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";

export const SampleVariantConsequence: Component = () => {
  const {
    sample,
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();

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
            links={[
              { href: "/samples", label: "Samples" },
              { href: "/samples/" + sample().data.index.toString(), label: sample().data.person.individualId },
              { href: "/samples/" + sample().data.index.toString() + "/variants", label: "Variants" },
              {
                href: "/samples/" + sample().data.index.toString() + "/variants/" + variant().id.toString(),
                label:
                  variant().data.c +
                  ":" +
                  variant().data.p.toString() +
                  " " +
                  variant()
                    .data.a.map((a) => variant().data.r + ">" + (a !== null ? a : "."))
                    .join(" / "),
              },
              {
                href: "#",
                label: `Consequence #${consequenceId}`,
              },
            ]}
          ></Breadcrumb>
          <div class="columns">
            <div class="column is-6">
              <h1 class="title is-5">Consequence</h1>
              <ConsequenceTable
                csqMetadata={recordsMetadata().info.CSQ.nested.items}
                csqValues={getSpecificConsequence(variant().data.n.CSQ, consequenceId)}
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
