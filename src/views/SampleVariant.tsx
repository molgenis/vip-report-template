import { Component, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { getConfig, getMetadata, getRecordById, getSampleById } from "./data/data";
import { parseVariantType } from "../utils/variantType.ts";
import { VariantContainer } from "../components/VariantContainer.tsx";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";
import { Item, Sample } from "@molgenis/vip-report-api";
import { getPedigreeSamples } from "../utils/sample.ts";

export const SampleVariant: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const sample = createAsync(() => getSampleById(props.params.sampleId));
  const samples = (): Item<Sample>[] => (sample() ? getPedigreeSamples(sample()!) : []);
  const record = createAsync(() => getRecordById(props.params.variantId, samples()));
  const metadata = createAsync(() => getMetadata());
  const config = createAsync(() => getConfig());

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <Show when={record()} fallback={<Loader />}>
          {(record) => (
            <>
              <VariantBreadcrumb variantType={variantType()} sample={sample()} record={record()} />
              <Show when={metadata()} fallback={<Loader />}>
                {(metadata) => (
                  <Show when={config()} fallback={<Loader />}>
                    {(config) => (
                      <VariantContainer
                        config={config()}
                        metadata={metadata()}
                        variantType={variantType()}
                        record={record()}
                        sample={sample()}
                      />
                    )}
                  </Show>
                )}
              </Show>
            </>
          )}
        </Show>
      )}
    </Show>
  );
};
