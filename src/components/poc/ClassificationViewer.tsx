import { Component, createEffect, createResource } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import type { VariantKey } from "../../types/NotesApi";
import { retrieveClassification } from "../../api/NotesApi.utils";

export const ClassificationViewer: Component<{ rd3: CellValueRD3; altIndex: number; refresh?: number }> = (props) => {
  const variantKey: VariantKey = {
    Chromosome: props.rd3.r.c,
    Position: props.rd3.r.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.r.a[0],//FIXME: what to do with multiple alts
    RU_NR: undefined, //FIXME
    RU: undefined, //FIXME
    END: undefined, //FIXME
  };

  const reportId: string = props.rd3.report;
  const feature: string = "clinical_significance";

  // Fetch initial classification from NotesApi
  const [classification, { refetch }] = createResource(async () => {
    const c = retrieveClassification(variantKey, feature, reportId);
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