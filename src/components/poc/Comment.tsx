import { Component, createResource, Show, createEffect } from "solid-js";
import { CellValueUserClassification } from "../../types/configCellComposed";
import { retrieveNotesForVariant } from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";
import { getNotesApi } from "../../api/NotesApiFactory";

export const Comment: Component<{
  userClassification: CellValueUserClassification;
  refresh?: number;
  callback: () => void;
}> = (props) => {
  const notesApi = getNotesApi();
  const reportId = () => props.userClassification.report;

  const variantKey = {
    Chromosome: props.userClassification.c,
    Position: props.userClassification.p,
    Reference: props.userClassification.r,
    Alternative: props.userClassification.a,
    END: props.userClassification.END,
    feature: props.userClassification.feature,
  };

  const [notes, { refetch }] = createResource(async () => {
    return retrieveNotesForVariant(
      notesApi,
      variantKey,
      reportId(),
      props.userClassification.s.item.data.person.individualId,
      true,
    );
  });

  createEffect(() => {
    if (props.refresh !== undefined) {
      refetch();
    }
  });

  const value = () => {
    const list = notes();
    if (!list || list.length === 0) return "-";

    return list
      .map(
        (note) =>
          `${note.createdBy} (${formatDate(note.updatedAt)}): ${note.content}`,
      )
      .join("\n");
  };

  const hasNotes = () => {
    const list = notes();
    return !!list && list.length > 0;
  };

  return (
    <>
      <abbr title={value()} class="ml-1 is-clickable">
        <Show when={hasNotes()}>
          <button onClick={() => props.callback()}>
            <span>
              <i class="fas fa-comment has-text-info" />
            </span>
          </button>
        </Show>
      </abbr>
    </>
  );
};