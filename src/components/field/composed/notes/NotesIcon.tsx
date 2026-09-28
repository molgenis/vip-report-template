import { Component, createResource, createSignal, For, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveNotesForVariant } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { VariantKey } from "../../../../types/NotesApi";
import { dataVersion } from "../../../../utils/upload/uploadSignal";
import { formatDate } from "../../../../utils/dateUtils";

const TOOLTIP_MAX_WIDTH = 750; // keep in sync with .notes-tooltip max-width in scss
const VIEWPORT_MARGIN = 8;

export const Notes: Component<{
  userClassification: CellValueUserClassification;
  callback: () => void;
}> = (props) => {
  const notesApi = getNotesApi();
  const [tooltipOpen, setTooltipOpen] = createSignal(false);
  let anchorRef: HTMLElement | undefined;
  // `left` holds the balloon's RIGHT edge (balloon is shifted left via translate(-100%))
  const [pos, setPos] = createSignal({ top: 0, left: 0 });

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

  const updatePosition = () => {
    if (!anchorRef) return;

    const cell = anchorRef.closest("td, th") as HTMLElement | null;
    const rect = (cell ?? anchorRef).getBoundingClientRect();

    const right = Math.min(
      Math.max(rect.right, TOOLTIP_MAX_WIDTH + VIEWPORT_MARGIN),
      window.innerWidth - VIEWPORT_MARGIN,
    );

    // Drop below the icon (not the whole cell) so it stays next to the note icon
    const top = anchorRef.getBoundingClientRect().bottom;

    setPos({ top, left: right });
  };

  const openTooltip = () => {
    updatePosition();
    setTooltipOpen(true);
  };

  createEffect(() => {
    if (!tooltipOpen()) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    onCleanup(() => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    });
  });

  return (
    <Show when={hasNotes()}>
      <span
        class="notes-tooltip-wrapper"
        ref={anchorRef}
        onMouseEnter={openTooltip}
        onMouseLeave={() => setTooltipOpen(false)}
        onFocusIn={openTooltip}
        onFocusOut={() => setTooltipOpen(false)}
      >
        <abbr class="ml-1 is-clickable" tabindex="0">
          <i class="fa fa-comment" />
        </abbr>

        <Show when={tooltipOpen()}>
          <Portal mount={document.body}>
            <div
              class="notes-tooltip notes-tooltip--portal"
              role="tooltip"
              style={{
                position: "fixed",
                top: `${pos().top}px`,
                left: `${pos().left}px`,
                transform: "translate(-100%, 6px)",
              }}
            >
              <For each={notes()}>
                {(note) => (
                  <div class="notes-tooltip-entry">
                    <span>{note.content}</span>
                    <Show when={noteMeta(note)}>
                      &nbsp;<span class="notes-tooltip-meta">({noteMeta(note)})</span>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Portal>
        </Show>
      </span>
    </Show>
  );
};
