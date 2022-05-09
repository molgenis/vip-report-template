import { Component, createResource, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "../api/Api";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import api from "../Api";
import { Breadcrumb } from "../components/Breadcrumb";
import { getConsequenceLabel, getCsqHeaderIndex, getSpecificConsequence } from "../utils/viewUtils";
import { ConsequenceTable } from "../components/ConsequenceTable";

export const VariantConsequence: Component = () => {
  const {
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();
  return (
    <>
      {
        <Show when={!variant.loading && !recordsMetadata.loading} fallback={<Loader />}>
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
            <div class="column">
              <h1 class="title">Consequence</h1>
              <ConsequenceTable
                csqHeader={recordsMetadata().info.CSQ.nested.items}
                csq={getSpecificConsequence(variant().data.n.CSQ, consequenceId)}
              ></ConsequenceTable>
            </div>
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