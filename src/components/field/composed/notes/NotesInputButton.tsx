import { Component, createSignal, createResource, createEffect, Show } from "solid-js";
import { Notes } from "./NotesIcon";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { ClassificationViewer } from "./ClassificationIcon";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import { Classification, ClassificationOption, Note, Status, VariantKey } from "../../../../types/NotesApi";
import { retrieveClassification, retrieveNotesForVariant, stripOuterQuotes } from "../../../../api/NotesApi.utils";
import { NotesInputModal } from "./NotesInputModal";
import { ClassificationSelector } from "./ClassificationSelector";
import { NoteForm } from "./NoteForm";
import { NotesList } from "./NotesList";
import { dataVersion, notifyDataChanged } from "../../../../utils/upload/uploadSignal";

const notesApi = getNotesApi();

type NotesInputButtonProps = {
  value: CellValueUserClassification;
};

export const NotesInputButton: Component<NotesInputButtonProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [classificationSaved, setClassificationSaved] = createSignal(false);
  const [username, setUsername] = createSignal<string>(stripOuterQuotes(notesApi.getCurrentUserName()) as string);

  const openModal = () => {
    setClassificationSaved(false);
    const current = stripOuterQuotes(notesApi.getCurrentUserName()) as string;
    setUsername(current);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const [classificationOptions] = createResource(async () => {
    const options = await notesApi.getClassificationOptions();
    return !options || options.length === 0 ? props.value.options : options;
  });

  const [isSetUsernameEnabled] = createResource(async () => {
    return !notesApi.isUsernameFromBackend();
  });

  const defaultClassification: ClassificationOption = {
    value: "",
    label: "Select a classification",
  };

  const variantKey = (): VariantKey => ({
    chromosome: props.value.c,
    position: props.value.p,
    reference: props.value.r,
    alternative: props.value.a,
    end: props.value.end,
    feature: props.value.feature ?? "",
    hgvsC: props.value.hgvsC ?? "",
    hgvsP: props.value.hgvsP ?? "",
    ru: props.value.ru ?? "",
    ruNr: props.value.ruNr,
  });

  const reportId = () => props.value.report;

  const sampleId = () => (props.value.s !== undefined ? props.value.s.item.data.person.individualId : undefined);

  const status: Status = "approved";

  const [classification, { refetch: refetchClassification }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      version: dataVersion(),
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId),
  );

  const [value, setValue] = createSignal<ClassificationOption>(defaultClassification);

  createEffect(() => {
    const current = classification();
    const opts = classificationOptions();
    if (!current || !opts) return;

    const opt = opts.find((o) => o.value === current.value);
    setValue(opt ?? defaultClassification);
  });

  const handleChange = async (val: string) => {
    const selectedOption = classificationOptions()?.find((o) => o.value === val) ?? defaultClassification;
    setValue(selectedOption);

    try {
      const currentValue: Classification | undefined = classification();

      await notesApi.storeClassification({
        value: val,
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
      notifyDataChanged();
      setClassificationSaved(true);
    } catch (error) {
      console.error("Classification save error:", error);
    }
  };

  const [notes, { refetch: refetchNotes }] = createResource(
    () => ({ vk: variantKey(), reportId: reportId(), sampleId: sampleId(), version: dataVersion() }),
    async (source) => {
      return retrieveNotesForVariant(notesApi, source.vk, source.reportId, source.sampleId, false);
    },
  );

  const [noteValue, setNoteValue] = createSignal("");
  const saveNote = async () => {
    try {
      if (!noteValue().trim()) return;

      await notesApi.setCurrentUserName(username() || "");

      await notesApi.storeNote({
        id: undefined,
        content: noteValue(),
        variantKey: variantKey(),
        reportId: reportId(),
        sampleId: sampleId(),
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: username() || undefined,
      });

      notifyDataChanged();
      setNoteValue("");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const removeNote = async (note: Note) => {
    try {
      await notesApi.removeNote(note.id, reportId());
      await refetchNotes();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const disableAllInputs = () => props.value.ruNr === -1;

  return (
    <>
      <span>
        <a class="js-modal-trigger" onClick={openModal}>
          <i class="fas fa-edit" />
        </a>

        <ClassificationViewer userClassification={props.value} />
        <Notes userClassification={props.value} callback={openModal} />
      </span>

      <NotesInputModal isOpen={isModalOpen()} onClose={closeModal} userClassification={props.value}>
        <Show when={classificationSaved()}>
          <div class="notification is-success is-light is-flex is-justify-content-space-between is-align-items-center">
            <span>Classification saved successfully.</span>
            <button class="notes-modal-close" type="button">
              ×
            </button>
          </div>
        </Show>

        <div class="notes-modal-section">
          <h3 class="notes-modal-section-title">Classification</h3>
          <ClassificationSelector
            value={value().value}
            options={classificationOptions()?.map((option) => ({ id: option.value, label: option.label })) ?? []}
            onValueChange={handleChange}
            disabled={disableAllInputs()}
          />
        </div>

        <div class="notes-modal-section">
          <h3 class="notes-modal-section-title">Notes</h3>
          <NoteForm
            showUsernameField={!!isSetUsernameEnabled()}
            username={username()}
            onUsernameChange={setUsername}
            noteValue={noteValue()}
            onNoteValueChange={setNoteValue}
            onSave={saveNote}
            disabled={disableAllInputs()}
          />
          <NotesList
            loading={notes.loading}
            notes={notes()}
            error={notes.error}
            currentFeature={props.value.feature}
            onRemove={removeNote}
          />
        </div>
      </NotesInputModal>
    </>
  );
};
