import { Component, For, JSX, Show, createEffect, createMemo, createResource, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveClassification } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { ClassificationOption, VariantKey } from "../../../../types/NotesApi";
import { dataVersion } from "../../../../utils/upload/uploadSignal";
import { formatDate } from "../../../../utils/dateUtils";

const TOOLTIP_MAX_WIDTH = 750; // keep in sync with .notes-tooltip max-width in scss
const VIEWPORT_MARGIN = 8;

type ClassificationEntry = { value: string; createdBy?: string; createdAt?: Date };

const metaFor = (entry: ClassificationEntry) =>
  [entry.createdBy, entry.createdAt ? formatDate(entry.createdAt) : null].filter(Boolean).join(", ");

// Shared row for both "current user" and "other users" tooltip lists —
// the only difference between them is whether the label is italicized.
const TooltipRow: Component<{
  entry: ClassificationEntry;
  label: string;
  italic?: boolean;
}> = (props) => (
  <div class="notes-tooltip-entry">
    <span>{props.italic ? <i>{props.label}</i> : props.label}</span>
    <Show when={metaFor(props.entry)}>
      &nbsp<span class="notes-tooltip-meta">({metaFor(props.entry)})</span>
    </Show>
  </div>
);

export const ClassificationViewer: Component<{
  userClassification: CellValueUserClassification;
  options: ClassificationOption[];
  refresh?: number;
  currentUser: string;
}> = (props) => {
  const notesApi = getNotesApi();
  const reportId = () => props.userClassification.report;
  const [tooltipOpen, setTooltipOpen] = createSignal(false);
  let anchorRef: HTMLElement | undefined;
  const [pos, setPos] = createSignal({ top: 0, left: 0 });

  const variantKey = (): VariantKey => ({
    chromosome: props.userClassification.c,
    position: props.userClassification.p,
    reference: props.userClassification.r,
    alternative: props.userClassification.a,
    end: props.userClassification.end,
    feature: props.userClassification.feature,
    hgvsC: props.userClassification.hgvsC ?? "",
    hgvsP: props.userClassification.hgvsP ?? "",
    ru: props.userClassification.ru ?? "",
    ruNr: props.userClassification.ruNr,
  });

  const sampleId = () => props.userClassification.s?.item?.data?.person?.individualId;

  const [classifications, { refetch }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      version: dataVersion(),
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId),
  );

  const [consensus, { refetch: refetchConsensus }] = createResource(
    () => ({ vk: variantKey(), reportId: reportId(), version: dataVersion() }),
    async (source) => notesApi.getConsensusClassification(source.reportId, source.vk),
  );

  const currentUserClassifications = createMemo(
    () => classifications()?.filter((c) => c.createdBy === props.currentUser) ?? [],
  );

  const otherUserClassifications = createMemo(
    () => classifications()?.filter((c) => c.createdBy !== props.currentUser) ?? [],
  );

  const otherClassificationsForLabel = createMemo(() => {
    const consensusValue = consensus()?.value;
    const others = otherUserClassifications();
    return consensusValue ? others.filter((c) => c.value !== consensusValue) : others;
  });

  const ownValuesExcludingConsensus = createMemo(() =>
    currentUserClassifications()
      .filter((c) => c.value !== consensus()?.value)
      .map((c) => c.value),
  );

  const showMissingIconInLabel = createMemo(
    () => currentUserClassifications().length === 0 && otherClassificationsForLabel().length > 0,
  );

  const showMissingRowInTooltip = createMemo(
    () => currentUserClassifications().length === 0 && otherUserClassifications().length > 0,
  );

  const optionLabel = (entry: ClassificationEntry) =>
    props.options.find((option) => option.value === entry.value)?.label ?? entry.value;

  const labelSegments = createMemo(() => {
    const segments: { key: string; node: JSX.Element }[] = [];
    const c = consensus();

    if (c) segments.push({ key: "consensus", node: <b>{c.value}</b> });
    if (ownValuesExcludingConsensus().length) {
      segments.push({ key: "own", node: <>{ownValuesExcludingConsensus().join(", ")}</> });
    }
    if (otherClassificationsForLabel().length) {
      segments.push({
        key: "others",
        node: (
          <i>
            {otherClassificationsForLabel()
              .map((c) => c.value)
              .join(", ")}
          </i>
        ),
      });
    }
    return segments;
  });

  createEffect(() => {
    if (props.refresh) {
      refetch();
      refetchConsensus();
    }
  });

  const updatePosition = () => {
    if (!anchorRef) return;
    const rect = anchorRef.getBoundingClientRect();
    const idealLeft = rect.left + rect.width / 2;
    const halfWidth = TOOLTIP_MAX_WIDTH / 2;
    const left = Math.min(
      Math.max(idealLeft, halfWidth + VIEWPORT_MARGIN),
      window.innerWidth - halfWidth - VIEWPORT_MARGIN,
    );
    setPos({ top: rect.bottom, left });
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
    <span
      class="notes-tooltip-wrapper"
      ref={anchorRef}
      onMouseEnter={openTooltip}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocusIn={openTooltip}
      onFocusOut={() => setTooltipOpen(false)}
    >
      <abbr class="ml-1 is-clickable" tabindex="0">
        <Show when={showMissingIconInLabel()}>
          <i class="fas fa-circle-exclamation has-text-warning" />{" "}
        </Show>
        <For each={labelSegments()}>
          {(segment, i) => (
            <>
              {i() > 0 && ", "}
              {segment.node}
            </>
          )}
        </For>
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
              transform: "translate(-50%, 6px)",
            }}
          >
            <Show when={showMissingRowInTooltip()}>
              <div class="notes-tooltip-entry">
                <i class="fas fa-circle-exclamation has-text-warning" /> Not yet classified by current user.
              </div>
            </Show>

            <Show when={consensus()}>
              <div class="notes-tooltip-entry">
                <span>
                  <b>{consensus()?.label}</b>
                </span>
                &nbsp<span class="notes-tooltip-meta">(consensus)</span>
              </div>
            </Show>

            <For each={currentUserClassifications()}>
              {(entry) => <TooltipRow entry={entry} label={optionLabel(entry)} />}
            </For>

            <For each={otherUserClassifications()}>
              {(entry) => <TooltipRow entry={entry} label={optionLabel(entry)} italic />}
            </For>
          </div>
        </Portal>
      </Show>
    </span>
  );
};
