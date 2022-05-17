import { Component, createResource, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import api from "../Api";
import { Breadcrumb } from "../components/Breadcrumb";
import { getConsequenceLabel, getCsqHeaderIndex, getSpecificConsequence } from "../utils/viewUtils";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";

export const VariantConsequence: Component = () => {
  const {
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  const [decisionTree, decisionTreeActions] = createResource(async () => await api.getDecisionTree());

  recordsMetadataActions.mutate();
  decisionTreeActions.mutate();

  return (
    <>
      {
        <Show when={!variant.loading && !recordsMetadata.loading && !decisionTree.loading} fallback={<Loader />}>
          <Breadcrumb
            links={[
              { href: "/variants", label: "Variants" },
              {
                href: "/variants/" + variant().id.toString(),
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
            <div class="column is-6">
              <h1 class="title is-5">Record</h1>
              <VariantTable variant={variant().data} />
            </div>
            <div class="column">
              <h1 class="title is-5">Info</h1>
              <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
            </div>
          </div>
        </Show>
      }
    </>
  );
};
