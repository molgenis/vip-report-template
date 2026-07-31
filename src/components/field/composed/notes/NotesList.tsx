import { Component, For, Show } from "solid-js";
import { Note } from "../../../../types/NotesApi";
import { formatDate } from "../../../../utils/dateUtils";

type NotesListProps = {
  notes: Note[];
  userFeature: string;
  onRemoveNote: (note: Note) => void;
};

const formatNoteLabel = (note: Note) => {
  const feature = note.variantKey.feature ?? "";
  const hgvsC = note.variantKey.hgvsC ?? "";
  const hgvsP = note.variantKey.hgvsP ?? "";

  if (!feature && !hgvsC && !hgvsP) return "";
  if (!hgvsC && !hgvsP) return feature;

  const hgvsPart = hgvsC && hgvsP ? `${hgvsC}(${hgvsP})` : hgvsC ? hgvsC : `(${hgvsP})`;

  return feature ? `${feature}:${hgvsPart}` : hgvsPart;
};

const notesWithSameFeature = (notes: Note[], userFeature: string): Note[] =>
  notes.filter((note) => note.variantKey.feature === userFeature);

const notesWithOtherFeature = (notes: Note[], userFeature: string): Note[] =>
  notes.filter((note) => note.variantKey.feature !== userFeature);

export const NotesList: Component<NotesListProps> = (props) => {
  const sameFeatureNotes = () => notesWithSameFeature(props.notes, props.userFeature);
  const otherFeatureNotes = () => notesWithOtherFeature(props.notes, props.userFeature);

  return (
    <div class="mt-3">
      <Show when={sameFeatureNotes().length > 0}>
        <h4 class="has-text-weight-semibold">Notes for this feature</h4>
        <For each={sameFeatureNotes()}>
          {(note) => (
            <div class="box has-background-light mb-2 p-3">
              <div class="is-flex is-justify-content-space-between is-align-items-start">
                <div>
                  <span class="is-size-6 is-italic mb-1">
                    (
                    {note.createdBy && note.createdBy
                      ? `${note.createdBy} on ${formatDate(note.updatedAt)}`
                      : formatDate(note.updatedAt)}
                    )
                  </span>
                </div>

                <button class="button is-small is-danger is-light" onClick={() => props.onRemoveNote(note)}>
                  Remove note
                </button>
              </div>

              <div>{note.content}</div>
            </div>
          )}
        </For>
      </Show>

      <Show when={otherFeatureNotes().length > 0}>
        <h4 class="has-text-weight-semibold mt-4">Notes for other features</h4>
        <For each={otherFeatureNotes()}>
          {(note) => (
            <div class="box has-background-light mb-2 p-3">
              <div class="is-flex is-justify-content-space-between is-align-items-start">
                <div>
                  <span class="heading is-size-6 mb-1">({formatNoteLabel(note)} - </span>
                  <span class="is-size-6 is-italic mb-1">
                    {note.createdBy && note.createdBy
                      ? `${note.createdBy} on ${formatDate(note.updatedAt)}`
                      : formatDate(note.updatedAt)}
                    )
                  </span>
                </div>

                <button class="button is-small is-danger is-light" onClick={() => props.onRemoveNote(note)}>
                  Remove note
                </button>
              </div>

              <div>{note.content}</div>
            </div>
          )}
        </For>
      </Show>

      <Show when={props.notes.length === 0}>
        <p class="has-text-grey-light">No notes.</p>
      </Show>
    </div>
  );
};
