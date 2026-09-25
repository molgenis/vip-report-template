import { Component, createSignal, createResource, createEffect, Show, For } from "solid-js";
import { Notes } from "./NotesIcon";
import { CellValueUserClassification } from "../../../../types/configCellComposed";
import { ClassificationViewer } from "./ClassificationIcon";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import { Classification, ClassificationOption, Note, Status, VariantKey } from "../../../../types/NotesApi";
import {
  retrieveClassification,
  retrieveClassificationForUser,
  retrieveNotesForVariant,
  stripOuterQuotes,
} from "../../../../api/NotesApi.utils";
import { NotesInputModal } from "./NotesInputModal";
import { ClassificationSelector } from "./ClassificationSelector";
import { NoteForm } from "./NoteForm";
import { NotesList } from "./NotesList";
import { dataVersion, notifyDataChanged } from "../../../../utils/upload/uploadSignal";
import { ClassificationList } from "./ClassificationsList";
import { EmxSessionExpiredError } from "../../../../api/EmxNotesApi";
import { ErrorNotification } from "../../../../components/ErrorNotification"; // ADJUST to the real path
import { SummaryItem } from "./SummaryItem";

const notesApi = getNotesApi();

type NotesInputButtonProps = {
  userClassification: CellValueUserClassification;
};

type ConsensusCandidate = {
  id: string;
  value: string;
  label: string;
  source: string;
};

export const NotesInputButton: Component<NotesInputButtonProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [classificationSaved, setClassificationSaved] = createSignal(false);
  const [username, setUsername] = createSignal<string>(stripOuterQuotes(notesApi.getCurrentUserName()) as string);
  const [showOtherFeatures, setShowOtherFeaturesSignal] = createSignal<boolean>(notesApi.getShowOtherFeatures());
  const [sessionExpiredError, setSessionExpiredError] = createSignal<unknown>(undefined);

  const handleApiError = (error: unknown) => {
    console.error(error);
    if (error instanceof EmxSessionExpiredError) {
      setSessionExpiredError(error);
    }
  };

  const setShowOtherFeatures = (value: boolean) => {
    setShowOtherFeaturesSignal(value);
    notesApi.setShowOtherFeatures(value);
  };

  const openModal = () => {
    setClassificationSaved(false);
    const current = stripOuterQuotes(notesApi.getCurrentUserName()) as string;
    setUsername(current);
    setShowOtherFeaturesSignal(notesApi.getShowOtherFeatures());
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const [classificationOptions] = createResource(async () => {
    const options = await notesApi.getClassificationOptions();
    return !options || options.length === 0 ? props.userClassification.options : options;
  });

  const [isSetUsernameEnabled] = createResource(async () => {
    return !notesApi.isUsernameFromBackend();
  });

  const defaultClassification: ClassificationOption = {
    value: "",
    label: "Select a classification",
  };

  const variantKey = (): VariantKey => ({
    chromosome: props.userClassification.c,
    position: props.userClassification.p,
    reference: props.userClassification.r,
    alternative: props.userClassification.a,
    end: props.userClassification.end,
    feature: props.userClassification.feature ?? "",
    hgvsC: props.userClassification.hgvsC ?? "",
    hgvsP: props.userClassification.hgvsP ?? "",
    ru: props.userClassification.ru ?? "",
    ruNr: props.userClassification.ruNr,
  });

  const reportId = () => props.userClassification.report;

  const sampleId = () =>
    props.userClassification.s !== undefined ? props.userClassification.s.item.data.person.individualId : undefined;

  const status: Status = "approved";

  const [classification, { refetch: refetchClassification }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      version: dataVersion(),
    }),
    async (source) =>
      retrieveClassificationForUser(
        notesApi,
        source.vk,
        source.reportId,
        source.sampleId,
        notesApi.getCurrentUserName(),
      ),
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
      handleApiError(error);
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
      handleApiError(error);
    }
  };

  const removeNote = async (note: Note) => {
    try {
      await notesApi.removeNote(note.id, reportId());
      await refetchNotes();
    } catch (error) {
      handleApiError(error);
    }
  };

  const modalTitle = () => {
    const { feature, hgvsC, hgvsP, svType, ru, ruNr } = props.userClassification;

    if (svType === "STR") {
      return (
        <>
          {feature} (<b>Repeat unit:</b> {ru} <b>Number of units:</b> {ruNr})
        </>
      );
    }
    return `${hgvsC}` + `${hgvsP === null ? "" : "(" + hgvsP + ")"}`;
  };

  const disableAllInputs = () => props.userClassification.ruNr === -1;
  const isRuNrError = () => props.userClassification.ruNr === -1;

  const [classifications] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      sampleId: sampleId(),
      version: dataVersion(),
    }),
    async (source) => retrieveClassification(notesApi, source.vk, source.reportId, source.sampleId, false),
  );

  const [consensus, { refetch: refetchConsensus }] = createResource(
    () => (isModalOpen() ? { vk: variantKey(), reportId: reportId(), version: dataVersion() } : undefined),
    async (source) => notesApi.getConsensusClassification(source.reportId, source.vk),
  );

  createEffect(() => {
    const err = classification.error ?? notes.error ?? classifications.error ?? consensus.error;
    if (err) {
      handleApiError(err);
    }
  });

  const consensusCandidates = (): ConsensusCandidate[] => {
    const feature = props.userClassification.feature;
    const opts = classificationOptions() ?? [];
    const labelFor = (val: string) => opts.find((o) => o.value === val)?.label ?? val;

    const seenValues = new Set<string>();
    const candidates: ConsensusCandidate[] = [];

    const own = value();
    if (own.value) {
      candidates.push({
        id: "own",
        value: own.value,
        label: own.label ?? labelFor(own.value),
        source: "You",
      });
      seenValues.add(own.value);
    }

    const others = classifications() ?? [];
    for (const c of others) {
      if (c.variantKey.feature !== feature) continue;
      if (c.createdBy === username()) continue;
      if (!c.value || seenValues.has(c.value)) continue;

      candidates.push({
        id: c.id,
        value: c.value,
        label: labelFor(c.value),
        source: c.createdBy || "Unknown",
      });
      seenValues.add(c.value);
    }

    return candidates;
  };

  const [isEditingConsensus, setIsEditingConsensus] = createSignal(false);
  const [consensusDropdownValue, setConsensusDropdownValue] = createSignal<string>("");
  const [consensusText, setConsensusText] = createSignal("");

  const consensusButtonLabel = () => {
    const current = consensus();
    return current ? `Update consensus` : "Set consensus";
  };

  const openConsensusEditor = () => {
    const current = consensus();
    setConsensusDropdownValue(current?.value ?? value().value);
    setConsensusText(current?.summary ?? "");
    setIsEditingConsensus(true);
  };

  const submitConsensus = async () => {
    console.log("submitConsensus", {
      value: consensusDropdownValue(),
      summary: consensusText(),
      variantKey: variantKey(),
      reportId: reportId(),
    });

    try {
      await notesApi.storeConsensusClassification(reportId(), variantKey(), consensusDropdownValue(), consensusText());
      await refetchConsensus();
      notifyDataChanged();
      setIsEditingConsensus(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Show when={sessionExpiredError()}>
        <ErrorNotification error={sessionExpiredError()} />
      </Show>

      <span>
        <a class="js-modal-trigger" onClick={openModal}>
          <i class="fas fa-edit" />
        </a>

        <ClassificationViewer
          userClassification={props.userClassification}
          options={classificationOptions() ?? []}
          currentUser={username()}
        />
        <Notes userClassification={props.userClassification} callback={openModal} />
      </span>

      <NotesInputModal
        isOpen={isModalOpen()}
        onClose={closeModal}
        userClassification={props.userClassification}
        title={modalTitle() as string}
      >
        <div class="is-flex is-justify-content-flex-end mb-2">
          <label class="checkbox">
            <input
              type="checkbox"
              checked={showOtherFeatures()}
              onChange={(e) => setShowOtherFeatures(e.currentTarget.checked)}
            />{" "}
            Show other features
          </label>
        </div>

        <Show when={classificationSaved()}>
          <div class="notification is-success is-light is-flex is-justify-content-space-between is-align-items-center">
            <span>Classification saved successfully.</span>
            <button class="notes-modal-close" type="button" onClick={() => setClassificationSaved(false)}>
              ×
            </button>
          </div>
        </Show>
        <Show when={isRuNrError()}>
          <div class="notification is-danger is-light mt-2">
            This tandem repeat allele was not observed for this sample.
          </div>
        </Show>
        <Show when={consensusCandidates().length !== 0}>
          <div class="notes-modal-section">
            <h3 class="notes-modal-section-title">Consensus</h3>

            <Show when={!isEditingConsensus()}>
              <Show when={consensus()}>
                <div>
                  <SummaryItem classification={consensus().label} summary={consensus().summary} />
                </div>
              </Show>
              <Show when={!consensus()}>
                <div>
                  <SummaryItem classification={"No consensus yet."} summary={""} />
                </div>
              </Show>

              <br />
              <button
                class="button is-primary ml-2"
                type="button"
                disabled={disableAllInputs() || consensus.loading || consensusCandidates().length === 0}
                onClick={openConsensusEditor}
              >
                {consensusButtonLabel()}
              </button>
            </Show>

            <Show when={isEditingConsensus()}>
              <div class="field">
                <div class="control">
                  <div class="select">
                    <select
                      value={consensusDropdownValue()}
                      onChange={(e) => setConsensusDropdownValue(e.currentTarget.value)}
                      disabled={disableAllInputs()}
                    >
                      <For each={consensusCandidates()}>
                        {(candidate) => <option value={candidate.value}>{candidate.label}</option>}
                      </For>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field has-addons">
                <div class="control is-expanded">
                  <textarea
                    rows="2"
                    cols="50"
                    value={consensusText()}
                    onInput={(e) => setConsensusText(e.currentTarget.value)}
                    disabled={disableAllInputs()}
                    class="textarea"
                    placeholder="Consensus summary..."
                  />
                  <br />
                  <button class="button is-primary ml-2" onClick={submitConsensus} disabled={disableAllInputs()}>
                    Submit consensus
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </Show>
        <div class="notes-modal-section">
          <h3 class="notes-modal-section-title">Classification</h3>
          <ClassificationSelector
            value={value().value}
            options={classificationOptions() ?? []}
            onValueChange={handleChange}
            disabled={disableAllInputs()}
          />
          <ClassificationList
            loading={notes.loading}
            classifications={classifications()}
            error={notes.error}
            currentFeature={props.userClassification.feature}
            options={classificationOptions()}
            currentUser={username()}
            showOtherFeatures={showOtherFeatures()}
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
            currentFeature={props.userClassification.feature}
            onRemove={removeNote}
            showOtherFeatures={showOtherFeatures()}
            currentUser={username()}
          />
        </div>
      </NotesInputModal>
    </>
  );
};
