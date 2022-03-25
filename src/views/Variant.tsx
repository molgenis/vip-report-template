import { Component, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";

export const Variant: Component = () => {
  const variant: Resource<Record> = useRouteData();

  return (
    <Show when={!variant.loading} fallback={<Loader />}>
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
                <Link href={"/variants"}>Variants</Link>
              </li>
              <li class="is-active">
                <a href="#">
                  {variant().c + ":" + variant().p.toString() + " " + variant().r + ">" + variant().a.join(" or ")}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <For each={Object.entries(variant())}>
        {([key, value]) => (
          <p>
            {key}={value as unknown as string}
          </p>
        )}
      </For>
      <GenomeBrowser contig={variant().c} position={variant().p} />
    </Show>
  );
};
