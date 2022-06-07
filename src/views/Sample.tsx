import { Component, For, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { SampleRouteData } from "./data/SampleData";

export const Sample: Component = () => {
  const { sample } = useRouteData<SampleRouteData>();

  return (
    <Show when={!sample.loading} fallback={<Loader />}>
      <Breadcrumb items={[{ href: "/samples", text: "Samples" }, { text: sample().data.person.individualId }]} />
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
