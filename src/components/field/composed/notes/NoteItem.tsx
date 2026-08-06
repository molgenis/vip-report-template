import { Component, Show } from "solid-js";
import { Note } from "../../../../types/NotesApi";
import { formatDate } from "../../../../utils/dateUtils";
import { formatNoteLabel } from "../../../../api/NotesApi.utils";

type NoteItemProps = {
  note: Note;
  onRemove: (note: Note) => void;
  showFeatureLabel?: boolean;
};

export const NoteItem: Component<NoteItemProps> = (props) => {
  const byline = () =>
    props.note.createdBy && props.note.createdBy
      ? `${props.note.createdBy} on ${formatDate(props.note.updatedAt)}`
      : formatDate(props.note.updatedAt);

  return (
    <div class="box has-background-light mb-2 p-3">
      <div class="is-flex is-justify-content-space-between is-align-items-start">
        <div>
          <Show when={props.showFeatureLabel} fallback={<span class="is-size-6 is-italic mb-1">({byline()})</span>}>
            <span class="heading is-size-6 mb-1">({formatNoteLabel(props.note)} - </span>
            <span class="is-size-6 is-italic mb-1">{byline()})</span>
          </Show>
        </div>

        <button class="button is-small is-danger is-light" onClick={() => props.onRemove(props.note)}>
          Remove note
        </button>
      </div>

      <div>{props.note.content}</div>
    </div>
  );
};
