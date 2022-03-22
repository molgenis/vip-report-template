import { Component, For, Resource } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Sample as ApiSample } from "../api/Api";

export const Sample: Component = () => {
  const sample: Resource<ApiSample> = useRouteData();
  return (
    <>
      <p class="has-text-weight-semibold">Sample</p>
      {!sample.loading && (
        <>
          <div class="columns">
            <div class="column is-1">
              <For each={Object.keys(sample().person)}>{(key) => <p>{key}</p>}</For>
            </div>
            <div class="column is-1">
              <For each={Object.values(sample().person)}>{(value) => <p>{value}</p>}</For>
            </div>
          </div>
          <br />
          <Link href={`/samples/${sample().index}/variants`}>Variants</Link>
        </>
      )}
    </>
  );
};
