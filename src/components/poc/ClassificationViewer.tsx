import { Component, createEffect, createResource } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { retrieveClassification } from "../../api/NotesApi.utils";
import { createNotesApi } from "../../api/NotesApiFactory";

export const ClassificationViewer: Component<{ rd3: CellValueRD3; refresh?: number }> = (props) => {
  const notesApi = createNotesApi();

  const alts = () => props.rd3.r.data.a;
  const reportId = () => props.rd3.report;

  const variantKeyForAlt = (alt: string) => ({
    Chromosome: props.rd3.r.data.c,
    Position: props.rd3.r.data.p,
    Reference: props.rd3.r.data.r,
    Alternative: alt,
    RU_NR: undefined,
    RU: undefined,
    END: undefined,
  });

  const [classifications, { refetch }] = createResource(async () => {
    const altList = alts();
    const id = reportId();

    const results = await Promise.all(
      altList.map(async (alt) => {
        const vk = variantKeyForAlt(alt);
        const c = await retrieveClassification(notesApi, vk, id, props.rd3.s); //FIXME
        return c?.value ?? "-";
      }),
    );

    return results;
  });

  createEffect(() => {
    if (props.refresh) {
      refetch();
    }
  });

  const classesString = () => {
    const vals = classifications();
    if (!vals || vals.length === 0) return "-";
    return vals.join(", ");
  };

  return (
    <>
      <span>{classesString()}</span>
    </>
  );
};