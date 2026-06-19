import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  JSX,
  onCleanup,
} from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type {
  VariantKey,
  Status,
  ClassificationOption,
} from "../../types/NotesApi";
import {
  retrieveClassification,
} from "../../api/NotesApi.utils";

const notesApi = createNotesApi();

const DEFAULT_OPTION: ClassificationOption = {
  value: "-",
  description: "-",
};

export const Classification: Component<{ rd3: CellValueRD3, altIndex: number }> = (props) => {
  const [OPTIONS] = createResource(async () => {
    return notesApi.getClassificationOptions();
  });

  const variantKey: VariantKey = {
    Chromosome: props.rd3.r.c,
    Position: props.rd3.r.p,
    Reference: props.rd3.r.r,
    Alternative: props.rd3.r.a[0], // FIXME: what to do with multiple alts
    RU_NR: undefined, // FIXME
    RU: undefined, // FIXME
    END: undefined, // FIXME
  };

  const reportId: string = props.rd3.report;
  const sampleId: string = props.rd3.s;
  const feature = "clinical_significance"; // FIXME
  const status: Status = "approved"; // FIXME placeholder
  const [classification] = createResource(async () => {
    return retrieveClassification(variantKey, feature, reportId);
  });

  const [value, setValue] = createSignal<ClassificationOption>(DEFAULT_OPTION);

  createEffect(() => {
    const val = classification();
    if (!val) {
      setValue(DEFAULT_OPTION);
      return;
    }

    const options = OPTIONS();
    if (!options) return;

    const option = options.find((o) => o.value === val.value);
    if (option) {
      setValue(option);
    } else {
      setValue(DEFAULT_OPTION);
    }
  });

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedSave = async (newValue: string) => {
    if (timeout) clearTimeout(timeout);

    if(newValue !== '-'){
      timeout = setTimeout(async () => {
        try {
          await notesApi.storeClassification(
            {
              value: newValue,
              variantKey: variantKey,
              feature: feature,
              reportId: reportId,
              status: status,
              id: undefined,
              sampleId: sampleId,
              createdAt: undefined,
              updatedAt: undefined
            },
          );
        } catch (error) {
          console.error("Classification save error:", error);
        }
      }, 500);
    } else {
      notesApi.removeClassification(variantKey, sampleId, reportId);
    }
  };

  createEffect(() => {
    debouncedSave(value().value);
  });

  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
  });

  const handleChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (e) => {
    const opts = OPTIONS();
    if (!opts) return;

    const newVal = (e.currentTarget as HTMLSelectElement).value;
    if (newVal === "-") {
      setValue(DEFAULT_OPTION);
      return;
    }

    const option = opts.find((o) => o.value === newVal);
    if (option) {
      setValue(option);
    }
  };

  return (
    <select
      value={value().value}
      onChange={handleChange}
      disabled={classification.loading}
    >
      <option value={DEFAULT_OPTION.value}>{DEFAULT_OPTION.description}</option>

      <For each={OPTIONS() ?? []}>
        {(opt) => <option value={opt.value}>{opt.description}</option>}
      </For>
    </select>
  );
};