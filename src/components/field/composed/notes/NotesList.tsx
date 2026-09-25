import { Component, For, Show } from "solid-js";
import { Note } from "../../../../types/NotesApi";
import { NoteItem } from "./NoteItem";

type NotesListProps = {
  loading: boolean;
  notes: Note[] | undefined;
  error: unknown;
  currentFeature: string | undefined;
  currentUser: string;
  onRemove: (note: Note) => void;
  showOtherFeatures?: boolean;
};

export const NotesList: Component<NotesListProps> = (props) => {
  const notesWithSameFeature = () => {
    const list = props.notes;
    if (!list) return [];
    return list.filter((note) => note.variantKey.feature === props.currentFeature);
  };

  const notesWithOtherFeature = () => {
    const list = props.notes;
    if (!list) return [];
    return list.filter((note) => note.variantKey.feature !== props.currentFeature);
  };

  return (
    <>
      <Show when={!props.loading && props.notes}>
        <div class="mt-3">
          <Show when={notesWithSameFeature().length > 0}>
            <h4 class="has-text-weight-semibold">{props.showOtherFeatures ? "Notes for this feature" : "Notes"}</h4>
            <For each={notesWithSameFeature()}>
              {(note) => (
                <NoteItem note={note} onRemove={props.onRemove} canRemove={note.createdBy === props.currentUser} />
              )}
            </For>
          </Show>

          <Show when={props.showOtherFeatures && notesWithOtherFeature().length > 0}>
            <h4 class="has-text-weight-semibold mt-4">Notes for other features</h4>
            <For each={notesWithOtherFeature()}>
              {(note) => (
                <NoteItem
                  note={note}
                  onRemove={props.onRemove}
                  canRemove={note.createdBy === props.currentUser}
                  showFeatureLabel
                />
              )}
            </For>
          </Show>

          <Show when={(props.notes?.length ?? 0) === 0}>
            <p class="has-text-grey-light">No notes.</p>
          </Show>
        </div>
      </Show>

      <Show when={props.error}>
        <p class="help is-danger">Error loading notes: {String(props.error)}</p>
      </Show>
    </>
  );
};
