import { Component, For, Show, createEffect, createResource, createSignal } from "solid-js";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveClassification } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { VariantKey } from "../../../../types/NotesApi";
import { dataVersion } from "../../../../utils/upload/uploadSignal";
import { formatDate } from "../../../../utils/dateUtils";

export const ClassificationViewer: Component<{
  userClassification: CellValueUserClassification;
  options: { id: string; label: string }[];
  refresh?: number;
}> = (props) => {
  const notesApi = getNotesApi();
  const reportId = () => props.userClassification.report;
  const [tooltipOpen, setTooltipOpen] = createSignal(false);

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

  const [classification, { refetch }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      version: dataVersion(),
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId),
  );

  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  const classificationMeta = (classification: { createdBy?: string; createdAt?: Date }) => {
    return [classification.createdBy, classification.createdAt ? formatDate(classification.createdAt) : null]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <span
      class="notes-tooltip-wrapper"
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      onFocusIn={() => setTooltipOpen(true)}
      onFocusOut={() => setTooltipOpen(false)}
    >
      <abbr class="ml-1 is-clickable" tabindex="0">
        {classification()
          ?.map((x) => x.value)
          .join(", ")}
      </abbr>

      <Show when={tooltipOpen()}>
        <div class="notes-tooltip" role="tooltip">
          <For each={classification()}>
            {(classification) => (
              <div class="notes-tooltip-entry">
                <span>
                  {props.options.find((option) => option.id === classification.value)?.label ?? classification.value}
                </span>

                <Show when={classificationMeta(classification)}>
                  <span class="notes-tooltip-meta">({classificationMeta(classification)})</span>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>
    </span>
  );
};
