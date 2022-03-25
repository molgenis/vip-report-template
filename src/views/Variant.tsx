import { Component, For, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";

export const Variant: Component = () => {
  const variant: Resource<Record> = useRouteData();

  return (
    <Show when={!variant.loading} fallback={<Loader />}>
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
