import { Component, Show } from "solid-js";
import { Classification, ClassificationOption } from "../../../../types/NotesApi";
import { formatDate } from "../../../../utils/dateUtils";
import { formatNoteLabel } from "../../../../api/NotesApi.utils";

type NoteItemProps = {
  classification: Classification;
  showFeatureLabel?: boolean;
  options: ClassificationOption[];
  currentUser?: string;
};

export const ClassificationItem: Component<NoteItemProps> = (props) => {
  const isOwnClassification = () =>
    !!props.classification.createdBy && props.classification.createdBy === props.currentUser;

  const byline = () => (
    <Show when={props.classification.createdBy} fallback={formatDate(props.classification.updatedAt)}>
      <span classList={{ "has-text-weight-bold": isOwnClassification() }}>{props.classification.createdBy}</span>
      {` on ${formatDate(props.classification.updatedAt)}`}
    </Show>
  );

  return (
    <div class="box has-background-light mb-2 p-3">
      <div class="is-flex is-justify-content-space-between is-align-items-start">
        <div>
          <Show when={props.showFeatureLabel} fallback={<span class="is-size-6 is-italic mb-1">({byline()})</span>}>
            <span class="heading is-size-6 mb-1">({formatNoteLabel(props.classification)} - </span>
            <span class="is-size-6 is-italic mb-1">{byline()})</span>
          </Show>
        </div>
      </div>

      <div>
        {props.options !== undefined
          ? (props.options.find((option) => option.value === props.classification.value)?.label ??
            props.classification.value)
          : []}
      </div>
    </div>
  );
};
