import { Component, createEffect, createResource, createSignal, For, onCleanup } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type { VariantKey, FeatureIdentifier, ReportId, Status } from "../../types/NotesApi";

const notesApi = createNotesApi();

export const Classification: Component<{ rd3: CellValueRD3 }> = (props) => {
  const OPTIONS = ["-", "B", "LB", "VUS", "LP", "P"] as const;
  type Option = (typeof OPTIONS)[number];

  const variantKey: VariantKey = {
    Chromosome: props.rd3.c,
    Position: props.rd3.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.a,
    Identifier: props.rd3.id + "", // FIXME string
  };

  const reportId: ReportId = props.rd3.report;
  const feature: FeatureIdentifier = "clinical_significance";
  const status: Status = "approved";

  // Fetch initial classification from NotesApi
  const [classification] = createResource(async () => {
    const c = await notesApi.retrieveClassification(variantKey, feature, reportId);
    return c?.value ?? "-";
  });

  const [value, setValue] = createSignal<string>("-");

  // Initialize value from fetched classification
  createEffect(() => {
    const val = classification();
    if (val && OPTIONS.includes(val as Option)) {
      setValue(val);
    }
  });

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedSave = async (newValue: string) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      try {
        await notesApi.storeClassification(
          {
            value: newValue,
            variantKey: variantKey,
            feature: feature,
            reportId: reportId,
            status: status
          },
        );
      } catch (error) {
        console.error("Classification save error:", error);
      }
    }, 500);
  };

  // Debounce on value change
  createEffect(() => {
    debouncedSave(value());
  });

  // Cleanup timeout
  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
  });

  return (
    <select
      value={value()}
      onChange={(e) => setValue(e.currentTarget.value as Option)}
      disabled={classification.loading}
    >
      <For each={OPTIONS}>{(opt) => <option value={opt}>{opt}</option>}</For>
    </select>
  );
};