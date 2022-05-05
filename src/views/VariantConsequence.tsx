import { Component, createResource, For, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "../api/Api";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { Value } from "../api/vcf/ValueParser";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import api from "../Api";
import { Breadcrumb } from "../components/Breadcrumb";

function getConsequenceLabel(CSQ: Value[][][], index: number) {
  return CSQ.length >= index ? (CSQ[index].length >= 1 ? CSQ[index][1].join("&") : "#") : "#";
}

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
        <Show when={!variant.loading} fallback={<Loader />}>
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
                label: getConsequenceLabel(variant().data.n.CSQ, consequenceId),
              },
            ]}
          ></Breadcrumb>
          <h1>Variant consequence Page</h1>
        </Show>
      }
    </>
  );
};
