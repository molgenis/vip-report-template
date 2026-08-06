import { Component, createEffect, createResource } from "solid-js";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { retrieveClassification } from "../../../../api/NotesApi.utils";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import type { VariantKey } from "../../../../types/NotesApi";

export const ClassificationViewer: Component<{
  userClassification: CellValueUserClassification;
  refresh?: number;
}> = (props) => {
  const notesApi = getNotesApi();
  const reportId = () => props.userClassification.report;

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
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId),
  );

  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  return <span>{classification()?.value}</span>;
};
