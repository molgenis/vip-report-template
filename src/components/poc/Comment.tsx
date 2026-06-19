import { Component, createResource, Show, createEffect } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import type { VariantKey } from "../../types/NotesApi";
import { retrieveNotesForVariant } from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";


export const Comment: Component<{ rd3: CellValueRD3; refresh?: number; altIndex: number }> = (props) => {
  const variantKey = () => ({
    Chromosome: props.rd3.r.c,
    Position: props.rd3.r.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.r.a[0],//FIXME: what to do with multiple alts
    RU_NR: undefined, //FIXME
    RU: undefined, //FIXME
    END: undefined, //FIXME
  }) as VariantKey;

  const reportId = () => props.rd3.report;

  // Fetch all notes for the variant from browser storage via notesApi
  const [notes, { refetch }] = createResource(async () => {
    return await retrieveNotesForVariant(variantKey(), reportId());
  });

  // Refetch when refresh prop changes
  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  // Format notes into display text
  const value = () => {
    const notesList = notes();
    if (!notesList || notesList.length === 0) return "-";
    return notesList
      .map((note) => note.createdBy + "("+ formatDate(note.updatedAt) + ") : " + note.content)
      .join("\n");
  };

  // Check if there are any notes
  const hasNotes = () => {
    const notesList = notes();
    return notesList && notesList.length > 0;
  };

  return (
    <>
      <abbr title={value()} class="ml-1 is-clickable">
        <Show when={hasNotes()} fallback={<i class="fas fa-comment has-text-grey" />}>
          <i class="fas fa-comment has-text-info" />
        </Show>
      </abbr>
    </>
  );
};