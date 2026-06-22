import { Component, createResource, Show, createEffect } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { retrieveNotesForVariant, retrieveClassification } from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";
import { createNotesApi } from "../../api/NotesApiFactory";

export const Comment: Component<{ rd3: CellValueRD3; refresh?: number; callback: () => void }> = (props) => {
  const notesApi = createNotesApi();
  const reportId = () => props.rd3.report;
  const alts = () => props.rd3.r.data.a;
  const feature = "clinical_significance";

  // Build all variant keys, one per alt allele, in order
  const variantKeys = () =>
    alts().map((alt) => ({
      Chromosome: props.rd3.r.data.c,
      Position: props.rd3.r.data.p,
      Reference: props.rd3.r.data.r,
      Alternative: alt,
      RU_NR: undefined, // FIXME
      RU: undefined,    // FIXME
      END: undefined,   // FIXME
    }));

  // Fetch notes for all alts, in order
  const [notesByAlt, { refetch }] = createResource(async () => {
    const keys = variantKeys();
    const id = reportId();

    const all = await Promise.all(
      keys.map((vk) => retrieveNotesForVariant(notesApi, vk, id, props.rd3.s, false)),
    );

    // all[i] is the list of notes for alts()[i]
    return all;
  });

  // Fetch classifications per alt, in order
  const [classificationsByAlt] = createResource(async () => {
    const keys = variantKeys();
    const id = reportId();

    const all = await Promise.all(
      keys.map(async (vk) => {
        const c = await retrieveClassification(notesApi, vk, feature, id, props.rd3.s);
        return c?.value ?? "-";
      }),
    );

    // all[i] is the classification value for alts()[i]
    return all;
  });

  // Refetch when refresh prop changes
  createEffect(() => {
    if (props.refresh !== undefined) {
      refetch();
    }
  });

  // Build display value: one block per alt, in alt order, with classification
  const value = () => {
    const data = notesByAlt();
    const classes = classificationsByAlt();
    const altList = alts();

    const parts: string[] = [];
    if(data !== undefined){
      data.forEach((notesForAlt, idx) => {
        const altLabel = altList[idx] ?? `ALT ${idx + 1}`;
        const cls = classes ? classes[idx] ?? "-" : "-";

        const notesText = notesForAlt
          .map(
            (note) =>
              `${note.createdBy} (${formatDate(note.updatedAt)}): ${note.content}`,
          )
          .join("\n");

        // Keep your original multi-line format, add classification on its own line
        if(altList.length > 1){
          parts.push(
            `Allele: ${altLabel}\nClassification: ${cls}\nNotes:\n${notesText}`,
          );
        } else{
          parts.push(`Classification: ${cls}\nNotes:\n${notesText}`);
        }
      });
    }
    else {
      parts.push(`Classification: ${classes !== undefined? classes[0]:"-"}`);
    }
    // All alts, in order; separated by blank line
    return parts.join("\n\n");
  };

  const hasNotes = () => {
    const data = notesByAlt();
    if (!data) return false;
    return data.some((list) => list && list.length > 0);
  };

  return (
    <>
      <abbr title={value()} class="ml-1 is-clickable">
        <Show when={hasNotes()} fallback={<button onClick={() => props.callback()}>
          <span>
            <i class="fas fa-comment has-text-grey" />
          </span>
        </button>}>
          <button onClick={() => props.callback()}>
          <span>
            <i class="fas fa-comment has-text-info" />
          </span>
        </button>
        </Show>
      </abbr>
    </>
  );
};