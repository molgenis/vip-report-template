import { Component, createEffect, createResource } from "solid-js";
import { CellValueUserClassification } from "../../types/configCellComposed";
import { retrieveClassification } from "../../api/NotesApi.utils";
import { getNotesApi } from "../../api/NotesApiFactory";

export const ClassificationViewer: Component<{ userClassification: CellValueUserClassification; refresh?: number }> = (props) => {
  const notesApi = getNotesApi();

  const reportId = () => props.userClassification.report;

  const variantKey= () => ({
    Chromosome: props.userClassification.c,
    Position: props.userClassification.p,
    Reference: props.userClassification.r,
    Alternative: props.userClassification.a,
    END: props.userClassification.END,
    feature: props.userClassification.feature,
  });

  const [classification, { refetch }] = createResource(async () => {
    return await retrieveClassification(notesApi, variantKey(), reportId(), props.userClassification.s.item.data.person.individualId);;
  });

  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  return (
      <span>{classification()?.value}</span>
  );
};