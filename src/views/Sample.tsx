import { Component, For, Show } from "solid-js";
import { createAsync, RouteSectionProps, A } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { getSample } from "./data/data";

export const Sample: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSample(Number(props.params.sampleId)));

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <>
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
          <A href={`/samples/${sample().id}/variants`}>Variants</A>
        </>
      )}
    </Show>
  );
};
