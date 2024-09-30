import { Component, createResource, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { getMetadata, getRecordById, getSampleById } from "./data/data";
import { fetchDecisionTree, fetchSampleTree } from "../Api.ts";
import { parseId } from "../utils/utils.ts";
import { VariantConsequenceContainer } from "../components/VariantConsequenceContainer.tsx";
import { parseVariantType } from "../utils/variantTypeUtils.ts";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";

export const SampleVariantConsequence: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const consequenceId = () => parseId(props.params.consequenceId);
  const metadata = createAsync(() => getMetadata());
  const sample = createAsync(() => getSampleById(props.params.sampleId));
  const record = createAsync(() => getRecordById(props.params.variantId));

  const [decisionTree] = createResource(fetchDecisionTree);
  const [sampleTree] = createResource(fetchSampleTree);

  return (
    <Show when={sample()} fallback={<Loader />}>
      {(sample) => (
        <Show when={record()} fallback={<Loader />}>
          {(record) => {
            return (
              <>
                <VariantBreadcrumb
                  variantType={variantType()}
                  sample={sample()}
                  record={record()}
                  consequenceId={consequenceId()}
                />
                <Show when={metadata()} fallback={<Loader />}>
                  {(metadata) => (
                    <Show when={decisionTree() !== undefined && sampleTree() != undefined} fallback={<Loader />}>
                      <VariantConsequenceContainer
                        metadata={metadata().records}
                        variantType={variantType()}
                        consequenceId={consequenceId()}
                        record={record()}
                        sample={sample()}
                        decisionTree={decisionTree()!}
                        sampleTree={sampleTree()!}
                      />
                    </Show>
                  )}
                </Show>
              </>
            );
          }}
        </Show>
      )}
    </Show>
  );
};
