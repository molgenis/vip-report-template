import { Component, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { getConfig, getDecisionTree, getMetadata, getRecordById } from "./data/data";
import { parseId } from "../utils/utils.ts";
import { VariantConsequenceContainer } from "../components/VariantConsequenceContainer.tsx";
import { parseVariantType } from "../utils/variantType.ts";
import { VariantBreadcrumb } from "../components/VariantBreadcrumb.tsx";

export const VariantConsequence: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const consequenceId = () => parseId(props.params.consequenceId);
  const metadata = createAsync(() => getMetadata());
  const record = createAsync(() => getRecordById(props.params.variantId));
  const config = createAsync(() => getConfig());
  const decisionTree = createAsync(() => getDecisionTree());

  return (
    <Show when={record()} fallback={<Loader />}>
      {(record) => {
        return (
          <>
            <VariantBreadcrumb variantType={variantType()} record={record()} consequenceId={consequenceId()} />
            <Show when={metadata()} fallback={<Loader />}>
              {(metadata) => (
                <Show when={config()} fallback={<Loader />}>
                  {(config) => (
                    <Show when={decisionTree()} fallback={<Loader />}>
                      {(decisionTree) => (
                        <VariantConsequenceContainer
                          config={config()}
                          metadata={metadata()}
                          variantType={variantType()}
                          consequenceId={consequenceId()}
                          record={record()}
                          sample={null}
                          decisionTree={decisionTree()}
                          sampleTree={null}
                        />
                      )}
                    </Show>
                  )}
                </Show>
              )}
            </Show>
          </>
        );
      }}
    </Show>
  );
};
