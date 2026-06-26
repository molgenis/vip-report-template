import { Component, createEffect, createSignal, JSX, Show, For, createResource } from "solid-js";
import { Portal } from "solid-js/web";
import { Comment } from "./Comment";
import { CellValueUserClassification } from "../../types/configCellComposed";
import { ClassificationViewer } from "./ClassificationViewer";
import { getNotesApi } from "../../api/NotesApiFactory";
import { Classification, ClassificationOption, Note, Status, VariantKey } from "../../types/NotesApi";
import { retrieveClassification, retrieveNotesForVariant } from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";
import { Select } from "../form/Select";

const notesApi = getNotesApi();

type NotesInputProps = {
  open: boolean;
  onClose: () => void;
  onDismissSaved: () => void;
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
        <div class="notes-modal-overlay" onClick={() => props.onClose()}>
          <div ref={setContentRef} class="notes-modal-content" onClick={(e) => e.stopPropagation()}>
            <header class="notes-modal-header">
              <h2 class="notes-modal-title">
                {props.userClassification.feature}:{props.userClassification.hgvsC}({props.userClassification.hgvsP})
              </h2>
            </header>

            <button onClick={() => props.onClose()} class="notes-modal-close">
              ×
            </button>

            <Show when={props.classificationSaved}>
              <div class="notification is-success is-light is-flex is-justify-content-space-between is-align-items-center">
                <span>Classification saved successfully.</span>
                <button class="delete" type="button" onClick={() => props.onDismissSaved()} />
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

  const [classificationOptions] = createResource(async () => {
    const options = await notesApi.getClassificationOptions();

    if (!options || options.length === 0) {
      return props.value.options;
    }

    return options;
  });

  const default_classification: ClassificationOption = {
    value: "",
    description: "Select a classifcation",
  };

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

  const sampleId = () => (props.value.s !== undefined ? props.value.s.item.data.person.individualId : undefined);

  const status: Status = "approved";

  const [classification, { refetch: refetchClassification }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      refresh: refreshKey(),
      sampleId: sampleId(),
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId),
  );

  const [value, setValue] = createSignal<ClassificationOption>(default_classification);

  createEffect(() => {
    const current = classification();
    const opts = classificationOptions();
    if (!current || !opts) return;

    const opt = opts.find((o) => o.value === current.value);
    if (opt) {
      setValue(opt);
    } else {
      setValue(default_classification);
    }
  });

  const handleChange = async (value: string) => {
    const selectedOption = classificationOptions().find((o) => o.value === value);
    setValue(selectedOption);

    try {
      const currentValue: Classification | undefined = classification();

      await notesApi.storeClassification({
        value: value,
        variantKey: variantKey(),
        reportId: reportId(),
        status,
        id: currentValue?.id,
        sampleId: sampleId(),
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

  const [notes, { refetch: refetchNotes }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      refresh: refreshKey(),
      sampleId: sampleId(),
    }),
    async (source) => {
      return retrieveNotesForVariant(notesApi, source.vk, source.reportId, source.sampleId, false);
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
        sampleId: sampleId(),
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
    return list.filter((note) => note.variantKey.feature === props.value.feature);
  };

  const notesWithOtherFeature = () => {
    const list = notes();
    if (!list) return [];
    return list.filter((note) => note.variantKey.feature !== props.value.feature);
  };

  const formatNoteLabel = (note: Note) => {
    const feature = note.variantKey.feature ?? "";
    const hgvsC = note.variantKey.hgvsC ?? "";
    const hgvsP = note.variantKey.hgvsP ?? "";

    if (!feature && !hgvsC && !hgvsP) return "";

    if (!hgvsC && !hgvsP) return feature;

    const hgvsPart = hgvsC && hgvsP ? `${hgvsC}(${hgvsP})` : hgvsC ? hgvsC : `(${hgvsP})`;

    return feature ? `${feature}:${hgvsPart}` : hgvsPart;
  };

  return (
    <>
      <span>
        <a onClick={showPopup}>
          <i class="fas fa-edit" />
        </a>

        <ClassificationViewer userClassification={props.value} refresh={refreshKey()} />
        <Comment userClassification={props.value} refresh={refreshKey()} callback={showPopup} />
      </span>

      <NotesInput
        open={open()}
        onClose={handleClose}
        onDismissSaved={() => setClassificationSaved(false)}
        userClassification={props.value}
        altIndex={altIndex()}
        onAltIndexChange={setAltIndex}
        classificationSaved={classificationSaved()}
      >
        <br />

        <div>
          <b>Classification:</b>{" "}
          <Select
            placeholder={"Select classification"}
            value={value().value}
            options={classificationOptions().map((option) => ({
              id: option.value,
              label: option.label,
            }))}
            onValueChange={(e) => handleChange(e.value)}
          />
        </div>

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
              <h4 class="has-text-weight-semibold">Notes for this feature</h4>

              <For each={notesWithSameFeature()}>
                {(note) => (
                  <div class="box has-background-light mb-2 p-3">
                    <div class="is-flex is-justify-content-space-between is-align-items-start">
                      <div>
                        <span class="is-size-6 is-italic mb-1">({formatDate(note.updatedAt)})</span>
                      </div>

                      <button class="button is-small is-danger is-light" onClick={() => removeNote(note)}>
                        Remove note
                      </button>
                    </div>

                    <div>{note.content}</div>
                  </div>
                )}
              </For>
            </Show>

            <Show when={notesWithOtherFeature().length > 0}>
              <h4 class="has-text-weight-semibold mt-4">Notes for other features</h4>

              <For each={notesWithOtherFeature()}>
                {(note) => (
                  <div class="box has-background-light mb-2 p-3">
                    <div class="is-flex is-justify-content-space-between is-align-items-start">
                      <div>
                        <span class="heading is-size-6 mb-1">({formatNoteLabel(note)} - </span>

                        <span class="is-size-6 is-italic mb-1">{formatDate(note.updatedAt)})</span>
                      </div>

                      <button class="button is-small is-danger is-light" onClick={() => removeNote(note)}>
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
          <p class="help is-danger">Error loading notes: {String(notes.error)}</p>
        </Show>
      </NotesInput>
    </>
  );
};
