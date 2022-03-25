import { Component, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Sample as ApiSample } from "../api/Api";
import { Loader } from "../components/Loader";

export const SampleVariants: Component = () => {
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
              <li>
                <Link href={"/samples/" + sample().index.toString()}>{sample().person.individualId}</Link>
              </li>
              <li class="is-active">
                <a href="#">Variants</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="has-background-warning" style={{ height: "300px", width: "500px" }}>
        <p>This screen displays variants in the context of a sample:</p>
        <p>
          - similar to <Link href="/variants">variants</Link> screen
        </p>
        <br />
        <p>Example link:</p>
        <Link href={"/samples/" + sample().index.toString() + "/variants/0"}>example variant #0</Link>
      </div>
    </Show>
  );
};
