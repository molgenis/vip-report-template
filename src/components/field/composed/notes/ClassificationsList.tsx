import { Component, For, Show } from "solid-js";
import { Classification } from "../../../../types/NotesApi";
import { ClassificationItem } from "./ClassficationItem";

type ClassificationListProps = {
  loading: boolean;
  classifications: Classification[] | undefined;
  error: unknown;
  currentFeature: string | undefined;
};

export const ClassificationList: Component<ClassificationListProps> = (props) => {
  const classificationsWithSameFeature = () => {
    const list = props.classifications;
    if (!list) return [];
    return list.filter((classification) => classification.variantKey.feature === props.currentFeature);
  };

  const classificationsWithOtherFeature = () => {
    const list = props.classifications;
    if (!list) return [];
    return list.filter((classification) => classification.variantKey.feature !== props.currentFeature);
  };

  return (
    <>
      <Show when={!props.loading && props.classifications}>
        <div class="mt-3">
          <Show when={classificationsWithSameFeature().length > 0}>
            <h4 class="has-text-weight-semibold">Classifications for this feature</h4>
            <For each={classificationsWithSameFeature()}>
              {(classification) => <ClassificationItem classification={classification} />}
            </For>
          </Show>

          <Show when={classificationsWithOtherFeature().length > 0}>
            <h4 class="has-text-weight-semibold mt-4">Classifications for other features</h4>
            <For each={classificationsWithOtherFeature()}>
              {(classification) => <ClassificationItem classification={classification} showFeatureLabel />}
            </For>
          </Show>

          <Show when={(props.classifications?.length ?? 0) === 0}>
            <p class="has-text-grey-light">No classifications.</p>
          </Show>
        </div>
      </Show>

      <Show when={props.error}>
        <p class="help is-danger">Error loading classificaitions: {String(props.error)}</p>
      </Show>
    </>
  );
};
