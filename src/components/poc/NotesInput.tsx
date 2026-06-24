import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Show,
  For,
  createResource,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Comment } from "./Comment";
import { CellValueUserClassification } from "../../types/configCellComposed";
import { ClassificationViewer } from "./ClassificationViewer";
import { getNotesApi } from "../../api/NotesApiFactory";
import {
  Classification,
  ClassificationOption,
  Note,
  Status,
} from "../../types/NotesApi";
import {
  retrieveClassification,
  retrieveNotesForVariant,
} from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";
import type { VariantKey } from "../../types/NotesApi"; // or wherever VariantKey lives

const notesApi = getNotesApi();

type NotesInputProps = {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
  userClassification: CellValueUserClassification;
  altIndex: number;
  onAltIndexChange: (index: number) => void;
  classificationSaved: boolean;
};

export const NotesInput: Component<NotesInputProps> = (props) => {
  let contentRef: HTMLDivElement | undefined;

  const setContentRef = (el: HTMLDivElement) => {
    contentRef = el;
  };

  createEffect(() => {
    if (props.open && contentRef) {
      contentRef.scrollTop = 0;
    }
  });

  return (
    <Show when={props.open}>
      <Portal>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 9999,
          }}
          onClick={props.onClose}
        >
          <div
            ref={setContentRef}
            style={{
              background: "#fff",
              padding: "1rem",
              "border-radius": "8px",
              "max-width": "800px",
              width: "100%",
              position: "relative",
              "max-height": "80vh",
              "overflow-y": "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header
              style={{
                "border-bottom": "1px solid #ddd",
                "margin-bottom": "1rem",
                padding: "0 0 0.5rem 0",
              }}
            >
              <h2 style={{ margin: 0, "font-size": "1.25rem" }}>
                {props.userClassification.feature}:
                {props.userClassification.hgvsC}(
                {props.userClassification.hgvsP})
              </h2>
            </header>

            <button
              onClick={props.onClose}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                "font-size": "1.2rem",
              }}
            >
              ×
            </button>

            <Show when={props.classificationSaved}>
              <div class="notification is-success is-light">
                Classification saved successfully.
              </div>
            </Show>

            {/* alt allele UI currently disabled */}
            <Show when={0 > 1}>
              <div style={{ "margin-bottom": "0.5rem" }}>
                <label>
                  <b>Select alt allele:</b>{" "}
                  <select
                    value={props.altIndex}
                    onChange={(e) =>
                      props.onAltIndexChange(Number(e.currentTarget.value))
                    }
                  >
                    <For each={undefined}>
                      {(alt, i) => (
                        <option value={i()}>
                          {alt.length > 5 ? `${alt.slice(0, 5)}…` : alt}
                        </option>
                      )}
                    </For>
                  </select>
                </label>
              </div>
            </Show>

            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

type NotesInputButtonProps = {
  value: CellValueUserClassification;
};

export const NotesInputButton: Component<NotesInputButtonProps> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [refreshKey, setRefreshKey] = createSignal(0);
  const [altIndex, setAltIndex] = createSignal(0);
  const [classificationSaved, setClassificationSaved] = createSignal(false);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const showPopup = () => {
    setClassificationSaved(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refresh();
  };

  const [OPTIONS] = createResource(async () => {
    return notesApi.getClassificationOptions();
  });

  const DEFAULT_OPTION: ClassificationOption = {
    value: "",
    description: "",
  };

  // FIX: include hgvsC and hgvsP in VariantKey to match your global type
  const variantKey = (): VariantKey => ({
    Chromosome: props.value.c,
    Position: props.value.p,
    Reference: props.value.r,
    Alternative: props.value.a,
    END: props.value.END,
    feature: props.value.feature,
    hgvsC: props.value.hgvsC ?? "",
    hgvsP: props.value.hgvsP ?? "",
  });

  const reportId = () => props.value.report;
  const sampleId =
    props.value.s !== undefined
      ? props.value.s.item.data.person.individualId
      : undefined;
  const status: Status = "approved";

  const [classification, { refetch: refetchClassification }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      refresh: refreshKey(),
    }),
    async (src) =>
      retrieveClassification(notesApi, src.vk, src.reportId, sampleId),
  );

  const [value, setValue] =
    createSignal<ClassificationOption>(DEFAULT_OPTION);

  const save = async () => {
    try {
      const currentValue: Classification | undefined = classification();

      await notesApi.storeClassification({
        value: value().value,
        variantKey: variantKey(),
        reportId: reportId(),
        status,
        id: currentValue?.id,
        sampleId,
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: undefined,
      });

      await refetchClassification();
      setClassificationSaved(true);
      refresh();
    } catch (error) {
      console.error("Classification save error:", error);
    }
  };

  const handleChange: JSX.EventHandlerUnion<HTMLSelectElement, Event> = (e) => {
    const opts = OPTIONS();
    if (!opts) return;

    const option = opts.find((o) => o.value === e.currentTarget.value);
    if (option) {
      setValue(option);
    }
  };

  const [notes, { refetch: refetchNotes }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      refresh: refreshKey(),
    }),
    async (src) => {
      return retrieveNotesForVariant(
        notesApi,
        src.vk,
        src.reportId,
        sampleId,
        false,
      );
    },
  );

  const [noteValue, setNoteValue] = createSignal("");

  const saveNote = async () => {
    try {
      if (!noteValue().trim()) return;

      await notesApi.storeNote({
        id: undefined,
        content: noteValue(),
        variantKey: variantKey(),
        reportId: reportId(),
        sampleId,
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: undefined,
      });

      await refetchNotes();
      setNoteValue("");
      refresh();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const removeNote = async (note: Note) => {
    try {
      await notesApi.removeNote(note.id, reportId());
      await refetchNotes();
      refresh();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const notesWithSameFeature = () => {
    const list = notes();
    if (!list) return [];
    return list.filter(
      (note) => note.variantKey.feature === props.value.feature,
    );
  };

  const notesWithOtherFeature = () => {
    const list = notes();
    if (!list) return [];
    return list.filter(
      (note) => note.variantKey.feature !== props.value.feature,
    );
  };

  const formatNoteLabel = (note: Note) => {
    const feature = note.variantKey.feature ?? "";
    const hgvsC = note.variantKey.hgvsC ?? "";
    const hgvsP = note.variantKey.hgvsP ?? "";

    if (!feature && !hgvsC && !hgvsP) return "";

    if (!hgvsC && !hgvsP) return feature;

    const hgvsPart =
      hgvsC && hgvsP
        ? `${hgvsC}(${hgvsP})`
        : hgvsC
        ? hgvsC
        : `(${hgvsP})`;

    return feature ? `${feature}:${hgvsPart}` : hgvsPart;
  };

  return (
    <>
      <span>
        <button onClick={showPopup}>
          <i class="fas fa-edit"></i>
        </button>

        <Comment
          userClassification={props.value}
          refresh={refreshKey()}
          callback={showPopup}
        />

        <ClassificationViewer
          userClassification={props.value}
          refresh={refreshKey()}
        />
      </span>

      <NotesInput
        open={open()}
        onClose={handleClose}
        userClassification={props.value}
        altIndex={altIndex()}
        onAltIndexChange={setAltIndex}
        classificationSaved={classificationSaved()}
      >
        <br />

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
                <option value={opt.value}>{opt.description}</option>
              )}
            </For>
          </select>
        </div>
        <br />
        <button class="button is-primary ml-2" onClick={save}>
          Save Classification
        </button>
        <br />
        <hr />
        <b>Add a note:</b>
        <br />

        <div class="field has-addons">
          <div class="control is-expanded">
            <textarea
              rows="2"
              cols="50"
              value={noteValue()}
              onInput={(e) => setNoteValue(e.currentTarget.value)}
              class="textarea"
            />
            <br />
            <button class="button is-primary ml-2" onClick={saveNote}>
              Add note
            </button>
          </div>
        </div>

        <Show when={!notes.loading && notes()}>
          <div class="mt-3">
            <Show when={notesWithSameFeature().length > 0}>
              <h4 class="has-text-weight-semibold">
                Notes for this feature
              </h4>
              <For each={notesWithSameFeature()}>
                {(note) => (
                  <div class="box has-background-light mb-2 p-3">
                    <div class="is-flex is-justify-content-space-between is-align-items-start">
                      <div>
                        <span class="is-size-6 is-italic mb-1">
                          ({formatDate(note.updatedAt)})
                        </span>
                      </div>

                      <button
                        class="button is-small is-danger is-light"
                        onClick={() => removeNote(note)}
                      >
                        Remove note
                      </button>
                    </div>

                    <div>{note.content}</div>
                  </div>
                )}
              </For>
            </Show>

            <Show when={notesWithOtherFeature().length > 0}>
              <h4 class="has-text-weight-semibold mt-4">
                Notes for other features
              </h4>
              <For each={notesWithOtherFeature()}>
                {(note) => (
                  <div class="box has-background-light mb-2 p-3">
                    <div class="is-flex is-justify-content-space-between is-align-items-start">
                      <div>
                        <span class="heading is-size-6 mb-1">
                          ({formatNoteLabel(note)} -{" "}
                        </span>
                        <span class="is-size-6 is-italic mb-1">
                          {formatDate(note.updatedAt)})
                        </span>
                      </div>

                      <button
                        class="button is-small is-danger is-light"
                        onClick={() => removeNote(note)}
                      >
                        Remove note
                      </button>
                    </div>

                    <div>{note.content}</div>
                  </div>
                )}
              </For>
            </Show>

            <Show when={(notes()?.length ?? 0) === 0}>
              <p class="has-text-grey-light">No notes.</p>
            </Show>
          </div>
        </Show>

        <Show when={notes.error}>
          <p class="help is-danger">
            Error loading notes: {String(notes.error)}
          </p>
        </Show>
      </NotesInput>
    </>
  );
};