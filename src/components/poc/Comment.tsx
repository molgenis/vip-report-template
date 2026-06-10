import { Component, createResource, Show, createEffect } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type { VariantKey, ReportId } from "../../types/NotesApi";

const notesApi = createNotesApi();

export const Comment: Component<{ rd3: CellValueRD3; refresh?: number }> = (props) => {
  const variantKey = () => ({
    Chromosome: props.rd3.c,
    Position: props.rd3.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.a,
    Identifier: props.rd3.id + "", // FIXME string
  }) as VariantKey;

  const reportId = () => props.rd3.report as ReportId;

  // Fetch all notes for the variant from browser storage via notesApi
  const [notes, { refetch }] = createResource(async () => {
    console.log("retrieve comment");
    return await notesApi.retrieveNotesForVariant(variantKey(), reportId());
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
      .map((note) => note.id + ": " + note.content)
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