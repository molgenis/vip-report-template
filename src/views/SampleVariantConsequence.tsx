import { Component, createResource, For, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "../api/Api";
import { fetchPedigreeSamples } from "../utils/ApiUtils";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { Value } from "../api/vcf/ValueParser";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { VariantSampleTable } from "../components/VariantSampleTable";
import api from "../Api";
import { Breadcrumb } from "../components/Breadcrumb";

// function getRecordSamples(record: Record, sample: Sample, pedigreeSamples: Sample[]) {
//   return [record.s[sample.index], ...pedigreeSamples.map((pedigreeSample) => record.s[pedigreeSample.index])];
// }

function getConsequenceLabel(CSQ: Value[][][], index: number) {
  return CSQ.length >= index ? (CSQ[index].length >= 1 ? CSQ[index][1].join("&") : "#") : "#";
}

export const SampleVariantConsequence: Component = () => {
  const {
    sample,
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();
  const [pedigreeSamples] = createResource(sample, fetchPedigreeSamples);
  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();
  return (
    <>
      {
        <Show
          when={!sample.loading && !variant.loading && !recordsMetadata.loading && !pedigreeSamples.loading}
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
                label: getConsequenceLabel(variant().data.n.CSQ, consequenceId),
              },
            ]}
          ></Breadcrumb>
          <h1>Sample variant consequence Page</h1>
        </Show>
      }
    </>
  );
};
