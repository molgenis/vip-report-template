import { Component, createResource, createSignal, For, Show } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type { Note } from "../../types/NotesApi";

const notesApi = createNotesApi();

export const CommentEditor: Component<{ rd3: CellValueRD3 }> = (props) => {
  const variantKey = () => ({
    Chromosome: props.rd3.c,
    Position: props.rd3.p,
    Reference: "", // FIXME: important because of deletions
    Alternative: props.rd3.a,
    Identifier: props.rd3.id + "", // FIXME string
  });

  const reportId = () => props.rd3.report;

  const [notes, { refetch }] = createResource<Note[]>(async () => {
    const note = await notesApi.retrieveNote(variantKey(), reportId());
    return note ? [note] : [];
  });

  const [value, setValue] = createSignal("");
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [uploadMessage, setUploadMessage] = createSignal<string | null>(null);

  const save = async () => {
    try {
      if (!value().trim()) return;

      await notesApi.storeNote(value(), variantKey(), reportId());
      setValue("");
      await refetch();
      console.log("Save!!!");
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const download = async () => {
    try {
      await notesApi.download(reportId());
      console.log("Download!!!");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage(null);
    }
  };

  const upload = async () => {
    try {
      const file = selectedFile();
      if (!file) {
        setUploadMessage("Please select a file first");
        return;
      }

      const result = await notesApi.load(file);
      setUploadMessage(result);
      notesApi.load(file);
      setSelectedFile(null);
      await refetch();
      console.log("Upload!!!", result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setUploadMessage(`Upload failed: ${errorMessage}`);
      console.error("Upload error:", error);
    }
  };

  const remove = async (noteId: string) => {
    try {
      await notesApi.removeNote(noteId);
      await refetch();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <>
      {/* Notes input section */}
      <div class="field has-addons">
        <div class="control is-expanded">
          <textarea
            rows="2"
            cols="50"
            value={value()}
            onInput={(e) => setValue(e.currentTarget.value)}
            class="textarea"
          />
        </div>
        <div class="control">
          <button class="button is-primary ml-2" onClick={save}>
            Save
          </button>
        </div>
        <div class="control">
          <button class="button is-primary ml-2" onClick={download}>
            Download
          </button>
        </div>
      </div>

      {/* File upload section */}
      <div class="field has-addons mt-2">
        <div class="control">
          <label class="button is-primary">
            <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} class="is-hidden" />
            {selectedFile() ? selectedFile()?.name : "Select Excel"}
          </label>
        </div>
        <div class="control">
          <button class="button is-success ml-2" onClick={upload} disabled={!selectedFile()}>
            Upload
          </button>
        </div>
      </div>

      {/* Upload message */}
      <Show when={uploadMessage()}>
        <p
          class={
            uploadMessage() && uploadMessage()!.startsWith("Upload failed")
              ? "help is-danger mt-2"
              : "help is-success mt-2"
          }
        >
          {uploadMessage()}
        </p>
      </Show>

      {/* Notes list */}
      <Show when={!notes.loading && notes()}>
        <div class="mt-3">
          <For each={notes() ?? []}>
            {(note) => (
              <div class="box has-background-light mb-2 p-3">
                <div class="is-flex is-justify-content-space-between is-align-items-start">
                  <div>
                    <span class="heading is-size-6 has-text-weight-semibold mb-1">{note.id}</span>
                    <span class="is-size-6 is-italic mb-1"> ({formatDate(note.updatedAt)})</span>
                  </div>
                  <button class="button is-small is-danger is-light" onClick={() => remove(note.id)}>
                    Remove
                  </button>
                </div>
                <div>{note.content}</div>
              </div>
            )}
          </For>

          <Show when={(notes()?.length ?? 0) === 0}>
            <p class="has-text-grey-light">No comments.</p>
          </Show>
        </div>
      </Show>

      <Show when={notes.error}>
        <p class="help is-danger">Error loading comments: {String(notes.error)}</p>
      </Show>
    </>
  );
};
