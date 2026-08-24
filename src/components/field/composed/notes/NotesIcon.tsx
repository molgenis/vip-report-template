import { Component, createResource, createSignal, For, Show } from "solid-js";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveNotesForVariant } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { VariantKey } from "../../../../types/NotesApi";
import { dataVersion } from "../../../../utils/upload/uploadSignal";
import { formatDate } from "../../../../utils/dateUtils";

export const Notes: Component<{
  userClassification: CellValueUserClassification;
  callback: () => void;
}> = (props) => {
  const notesApi = getNotesApi();
  const [tooltipOpen, setTooltipOpen] = createSignal(false);

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

  const [notes] = createResource(
    () => ({ vk: variantKey(), reportId: reportId(), sampleId: sampleId(), version: dataVersion() }),
    async (source) => {
      return retrieveNotesForVariant(notesApi, source.vk, source.reportId, source.sampleId, true);
    },
  );

  const hasNotes = () => {
    const list = notes();
    return !!list && list.length > 0;
  };

  const noteMeta = (note: { createdBy?: string; createdAt?: Date }) => {
    return [note.createdBy, note.createdAt ? formatDate(note.createdAt) : null].filter(Boolean).join(", ");
  };

  return (
    <Show when={hasNotes()}>
      <span
        class="notes-tooltip-wrapper"
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onFocusIn={() => setTooltipOpen(true)}
        onFocusOut={() => setTooltipOpen(false)}
      >
        <abbr class="ml-1 is-clickable" tabindex="0">
          <i class="fa fa-comment" />
        </abbr>

        <Show when={tooltipOpen()}>
          <div class="notes-tooltip" role="tooltip">
            <For each={notes()}>
              {(note) => (
                <div class="notes-tooltip-entry">
                  <span>{note.content}</span>
                  <Show when={noteMeta(note)}>
                    <span class="notes-tooltip-meta"> ({noteMeta(note)})</span>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Show>
      </span>
    </Show>
  );
};
