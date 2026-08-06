import { Component, createResource, Show, createEffect } from "solid-js";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveNotesForVariant } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { VariantKey } from "../../../../types/NotesApi";

export const Notes: Component<{
  userClassification: CellValueUserClassification;
  refresh?: number;
  callback: () => void;
}> = (props) => {
  const notesApi = getNotesApi();

  const reportId = () => props.userClassification.report;

  const variantKey = (): VariantKey => ({
    chromosome: props.userClassification.c,
    position: props.userClassification.p,
    reference: props.userClassification.r,
    alternative: props.userClassification.a,
    end: props.userClassification.end,
    feature: props.userClassification.feature ?? "",
    hgvsC: props.userClassification.hgvsC ?? "",
    hgvsP: props.userClassification.hgvsP ?? "",
    ru: props.userClassification.ru ?? "",
    ruNr: props.userClassification.ruNr,
  });

  const sampleId = () => props.userClassification.s.item.data.person.individualId;

  const [notes, { refetch }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      refresh: props.refresh ?? 0,
    }),
    async (source) => retrieveNotesForVariant(notesApi, source.vk, source.reportId, source.sampleId, true),
  );

  createEffect(() => {
    if (props.refresh !== undefined) {
      refetch();
    }
  });

  const value = () => {
    const list = notes();
    if (!list || list.length === 0) return "-";

    return list
      .map((note) => `${note.createdBy && note.createdBy ? `${note.createdBy}:` : ""} ${note.content}`)
      .join("\n");
  };

  const hasNotes = () => {
    const list = notes();
    return !!list && list.length > 0;
  };

  return (
    <Show when={hasNotes()}>
      <abbr title={value()} class="ml-1 is-clickable">
        <i class="fa fa-comment" />
      </abbr>
    </Show>
  );
};
