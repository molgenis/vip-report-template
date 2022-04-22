import { Component, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Sample as ApiSample } from "../api/Api";
import { Loader } from "../components/Loader";

export const Sample: Component = () => {
  const sample: Resource<ApiSample> = useRouteData();
  return (
    <Show when={!sample.loading} fallback={<Loader />}>
      <div class="columns is-gapless">
        <div class="column">
          <nav class="breadcrumb">
            <ul>
              <li>
                <Link href="/">
                  <span class="icon">
                    <i class="fa-solid fa-home" />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/samples">Samples</Link>
              </li>
              <li class="is-active">
                <a href="#">{sample().data.person.individualId}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
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
