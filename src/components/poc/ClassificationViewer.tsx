import { Component, createEffect, createResource } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type { VariantKey, FeatureIdentifier, ReportId, Status } from "../../types/NotesApi";

const notesApi = createNotesApi();

export const ClassificationViewer: Component<{ rd3: CellValueRD3; refresh?: number }> = (props) => {
  const variantKey: VariantKey = {
    Chromosome: props.rd3.c,
    Position: props.rd3.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.a,
    Identifier: props.rd3.id + "", // FIXME string
  };

  const reportId: ReportId = props.rd3.report;
  const feature: FeatureIdentifier = "clinical_significance";

  // Fetch initial classification from NotesApi
  const [classification, { refetch }] = createResource(async () => {
    const c = await notesApi.retrieveClassification(variantKey, feature, reportId);
    return c?.value ?? "-";
  });

  // Refetch when refresh prop changes
  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  return (
    <>
      <span>{classification() !== undefined ? classification() : "-"}</span>
    </>
  );
};