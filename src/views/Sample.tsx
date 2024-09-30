import { Component, For, Show } from "solid-js";
import { A, createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { getSampleById } from "./data/data";
import { href } from "../utils/utils.ts";

export const Sample: Component<RouteSectionProps> = (props) => {
  const sample = createAsync(() => getSampleById(props.params.sampleId));

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <>
          <Breadcrumb
            items={[{ href: href(["samples"]), text: "Samples" }, { text: sample().item.data.person.individualId }]}
          />
          <p class="has-text-weight-semibold">Sample</p>
          <div class="columns">
            <div class="column is-1">
              <For each={Object.keys(sample().item.data.person)}>{(key) => <p>{key}</p>}</For>
            </div>
            <div class="column is-1">
              <For each={Object.values(sample().item.data.person)}>{(value) => <p>{value}</p>}</For>
            </div>
          </div>
          <br />
          <A href={href(["samples", sample().item.id, "variants"])} end={true}>
            Variants
          </A>
        </>
      )}
    </Show>
  );
};
