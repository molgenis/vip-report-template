import { Component, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { Loader } from "../components/Loader";
import { Sample } from "../api/Api";

export const SampleVariant: Component = () => {
  const { sample, variant }: { sample: Resource<Sample>; variant: Resource<Record> } = useRouteData();

  return (
    <Show when={!sample.loading && !variant.loading} fallback={<Loader />}>
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
              <li>
                <Link href={"/samples/" + sample().index.toString() + "/variants"}>Variants</Link>
              </li>
              <li class="is-active">
                <a href="#">
                  {variant().c + ":" + variant().p.toString() + " " + variant().r + ">" + variant().a.join(",")}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="has-background-warning" style={{ height: "300px", width: "500px" }}>
        <p>This screen displays info for one vcf record in the context of a sample:</p>
        <p>- variant basic/info details</p>
        <p>- variant format details for this sample</p>
        <p>- variant format details for this sample family members</p>
        <p>- links to variant consequences</p>
      </div>
    </Show>
  );
};
