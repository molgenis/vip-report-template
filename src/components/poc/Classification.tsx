import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  JSX,
  on,
  onCleanup,
} from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/NotesApiFactory";
import type {
  Status,
  ClassificationOption,
} from "../../types/NotesApi";
import { Classification as ClassificationValue } from "../../types/NotesApi";
import { retrieveClassification } from "../../api/NotesApi.utils";
import { getRecordById } from "../../views/data/data";
import { createAsync } from "@solidjs/router";

const notesApi = createNotesApi();

const DEFAULT_OPTION: ClassificationOption = {
  value: "-",
  description: "-",
};

export const Classification: Component<{
  rd3: CellValueRD3;
  altIndex: number;
}> = (props) => {
  const [OPTIONS] = createResource(async () => {
    return notesApi.getClassificationOptions();
  });

  // ----------------------------
  // Variant key (ALT-aware)
  // ----------------------------
  const variantKey = () => {
    const r = props.rd3.r.data;
    const alt = r.a?.[props.altIndex];

    return {
      Chromosome: r.c,
      Position: r.p,
      Reference: r.r,
      Alternative: alt,
      RU_NR: undefined,
      RU: undefined,
      END: undefined,
    };
  };

  const reportId = () => props.rd3.report;
  const sampleId: string = props.rd3.s;
  const status: Status = "approved";

  // ----------------------------
  // Classification resource (reacts to ALT)
  // ----------------------------
  const [classification, { refetch }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
    }),
    async (src) => retrieveClassification(notesApi, src.vk, src.reportId, sampleId),
  );

  // ----------------------------
  // Local UI state
  // ----------------------------
  const [value, setValue] =
    createSignal<ClassificationOption>(DEFAULT_OPTION);

  const [selectedFeature, setSelectedFeature] =
    createSignal<string | undefined>();

  const record = createAsync(() =>
    getRecordById(String(props.rd3.r.id)),
  );

  // ----------------------------
  // Features
  // ----------------------------
  const features = () => {
    const data = record()?.data;
    if (!data) return [];

    const csqArray = data.n?.["CSQ"];
    if (!Array.isArray(csqArray)) return [];

    return csqArray.map((item) => ({
      Feature: item["Feature"],
      PICK: item["PICK"],
    }));
  };

  const resolveFeature = (stored?: string) => {
    const fs = features();
    if (!fs.length) return undefined;

    const normalized = stored?.trim();

    const match =
      normalized &&
      fs.find((f) => f.Feature === normalized)?.Feature;

    const picked = fs.find((f) => f.PICK === 1)?.Feature;
    const first = fs[0]?.Feature;

    return match ?? picked ?? first;
  };

  // ----------------------------
  // RESET UI WHEN ALT CHANGES
  // ----------------------------
  createEffect(
    on(() => props.altIndex, () => {
      setValue(DEFAULT_OPTION);
      setSelectedFeature(undefined);
    })
  );

  // ----------------------------
  // HYDRATE FROM STORED VALUE
  // ----------------------------
  createEffect(() => {
    const clazz = classification();
    const options = OPTIONS();
    const fs = features();

    if (!options || !fs.length) return;

    // classification dropdown
    const option =
      clazz
        ? options.find(o => o.value === clazz.value) ?? DEFAULT_OPTION
        : DEFAULT_OPTION;

    setValue(option);

    // feature selection
    setSelectedFeature(resolveFeature(clazz?.feature));
  });

  // ----------------------------
  // debounce save
  // ----------------------------
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedSave = (
    newValue: string,
    featureValue: string | undefined,
  ) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      try {
        const currentValue: ClassificationValue =
          classification();

        await notesApi.storeClassification({
          value: newValue !== "-" ? newValue : undefined,
          variantKey: variantKey(),
          feature: featureValue ?? resolveFeature() ?? undefined,
          reportId: reportId(),
          status,
          id: currentValue?.id,
          sampleId,
          createdAt: undefined,
          updatedAt: undefined,
          createdBy: undefined,
        });

        refetch();
      } catch (error) {
        console.error("Classification save error:", error);
      }
    }, 500);
  };

  // ----------------------------
  // reactive save trigger
  // ----------------------------
  createEffect(
    on(
      () => [value().value, selectedFeature()],
      () => {
        debouncedSave(value().value, selectedFeature());
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
  });

  // ----------------------------
  // handlers
  // ----------------------------
  const handleFeatureChange: JSX.EventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (e) => {
    setSelectedFeature(e.currentTarget.value);
  };

  const handleChange: JSX.EventHandlerUnion<
    HTMLSelectElement,
    Event
  > = (e) => {
    const opts = OPTIONS();
    if (!opts) return;

    const option = opts.find(
      (o) => o.value === e.currentTarget.value,
    );

    if (option) {
      setValue(option);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div>
      <b>Classification:</b>{" "}
      <select
        value={value().value}
        onChange={handleChange}
        disabled={classification.loading}
      >
        <option value={DEFAULT_OPTION.value}>
          {DEFAULT_OPTION.description}
        </option>

        <For each={OPTIONS() ?? []}>
          {(opt) => (
            <option value={opt.value}>
              {opt.description}
            </option>
          )}
        </For>
      </select>

      {" "}
      <b>Feature:</b>{" "}
      <select
        value={selectedFeature() ?? ""}
        onChange={handleFeatureChange}
      >
        <For each={features()}>
          {(f) => (
            <option value={f.Feature}>
              {f.Feature}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};