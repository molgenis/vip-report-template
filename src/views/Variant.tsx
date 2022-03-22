import { Component, For, Resource } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";

export const Variant: Component = () => {
  const variant: Resource<Record> = useRouteData();
  return (
    <>
      {!variant.loading && (
        <>
          <For each={Object.entries(variant())}>
            {([key, value]) => (
              <p>
                {key}={value as unknown as string}
              </p>
            )}
          </For>
          <GenomeBrowser variant={variant()} />
        </>
      )}
    </>
  );
};
