import { Component, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Item, Sample as ApiSample } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";

export const Sample: Component = () => {
  const sample: Resource<Item<ApiSample>> = useRouteData();
  return (
    <Show when={!sample.loading} fallback={<Loader />}>
      <Breadcrumb
        links={[
          { href: "/samples", label: "Samples" },
          { href: "#", label: sample().data.person.individualId },
        ]}
      ></Breadcrumb>
      <p class="has-text-weight-semibold">Sample</p>
      <div class="columns">
        <div class="column is-1">
          <For each={Object.keys(sample().data.person)}>{(key) => <p>{key}</p>}</For>
        </div>
        <div class="column is-1">
          <For each={Object.values(sample().data.person)}>{(value) => <p>{value}</p>}</For>
        </div>
      </div>
      <br />
      <Link href={`/samples/${sample().data.index}/variants`}>Variants</Link>
    </Show>
  );
};
