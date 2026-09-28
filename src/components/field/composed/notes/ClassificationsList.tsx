import { Component, For, Show } from "solid-js";
import { Classification, ClassificationOption } from "../../../../types/NotesApi";
import { ClassificationItem } from "./ClassficationItem";

type ClassificationListProps = {
  loading: boolean;
  classifications: Classification[] | undefined;
  error: unknown;
  currentFeature: string | undefined;
  options: ClassificationOption[];
  currentUser: string;
  showOtherFeatures?: boolean;
};

export const ClassificationList: Component<ClassificationListProps> = (props) => {
  const classificationsWithSameFeature = () => {
    const list = props.classifications;
    if (!list) return [];
    return list.filter(
      (classification) =>
        classification.variantKey.feature === props.currentFeature && props.currentUser !== classification.createdBy,
    );
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
            <h4 class="has-text-weight-semibold">
              {props.showOtherFeatures ? "Classifications from others for this feature" : "Classifications from others"}
            </h4>
            <For each={classificationsWithSameFeature()}>
              {(classification) => <ClassificationItem classification={classification} options={props.options} />}
            </For>
          </Show>

          <Show when={props.showOtherFeatures && classificationsWithOtherFeature().length > 0}>
            <h4 class="has-text-weight-semibold mt-4">Classifications for other features</h4>
            <For each={classificationsWithOtherFeature()}>
              {(classification) => (
                <ClassificationItem
                  classification={classification}
                  options={props.options}
                  currentUser={props.currentUser}
                  showFeatureLabel
                />
              )}
            </For>
          </Show>
        </div>
      </Show>

      <Show when={props.error}>
        <p class="help is-danger">Error loading classificaitions: {String(props.error)}</p>
      </Show>
    </>
  );
};
