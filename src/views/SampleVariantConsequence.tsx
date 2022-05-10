import { Component, createResource, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Metadata, Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "../api/Api";
import { fetchPedigreeSamples } from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantSampleTable } from "../components/VariantSampleTable";
import api from "../Api";
import { Breadcrumb } from "../components/Breadcrumb";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { getConsequenceLabel, getCsqHeaderIndex, getRecordSamples, getSpecificConsequence } from "../utils/viewUtils";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";

export const SampleVariantConsequence: Component = () => {
  const {
    sample,
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  const [decisionTree, decisionTreeActions] = createResource(async () => await api.getDecisionTree());

  recordsMetadataActions.mutate();
  decisionTreeActions.mutate();
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
                label: getConsequenceLabel(
                  variant().data.n.CSQ,
                  consequenceId,
                  getCsqHeaderIndex(recordsMetadata().info.CSQ.nested.items)
                ),
              },
            ]}
          ></Breadcrumb>
          <div class="columns">
            <div class="column is-6">
              <h1 class="title is-5">Consequence</h1>
              <ConsequenceTable
                csqHeader={recordsMetadata().info.CSQ.nested.items}
                csq={getSpecificConsequence(variant().data.n.CSQ, consequenceId)}
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
