import { Component, createEffect, createResource } from "solid-js";
import { CellValueUserClassification } from "../../types/configCellComposed";
import { retrieveClassification } from "../../api/NotesApi.utils";
import { getNotesApi } from "../../api/NotesApiFactory";

export const ClassificationViewer: Component<{ userClassification: CellValueUserClassification; refresh?: number }> = (
  props,
) => {
  const notesApi = getNotesApi();

  const reportId = () => props.userClassification.report;

  const variantKey = () => ({
    chromosome: props.userClassification.c,
    position: props.userClassification.p,
    reference: props.userClassification.r,
    alternative: props.userClassification.a,
    end: props.userClassification.end,
    feature: props.userClassification.feature,
    hgvsC: props.userClassification.hgvsC ?? "",
    hgvsP: props.userClassification.hgvsP ?? "",
    ru: props.userClassification.ru,
    ruNr: props.userClassification.ruNr,
  });

  const [classification, { refetch }] = createResource(async () => {
    return await retrieveClassification(
      notesApi,
      variantKey(),
      reportId(),
      props.userClassification.s.item.data.person.individualId,
    );
  });

  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  return <span>{classification()?.value}</span>;
};
