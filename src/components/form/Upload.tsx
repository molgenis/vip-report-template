import { Component, createSignal } from "solid-js";
import { getNotesApi } from "../../api/NotesApiFactory";
import { createFileApi } from "../../api/FileApi";

const notesApi = getNotesApi();
const fileApi = createFileApi(notesApi);

export const Upload: Component<{
  refetch?: () => void;
  reportId: string;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [uploading, setUploading] = createSignal(false);

  const handleFileSelect = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    setMessage(null);

    if (!file) return;

    setUploading(true);
    try {
      // 1) Read reportId from Excel metadata
      const reportIdFromFile = await fileApi.getReportIdFromFile(file);

      // 2) If different, ask user whether to continue
      if (reportIdFromFile !== props.reportId) {
        const proceed = window.confirm(
          `The selected file belongs to a different report.\n\n` + `Do you want to continue importing anyway?`,
        );
        if (!proceed) {
          // User cancelled: stop here, keep modal open
          setUploading(false);
          target.value = "";
          return;
        }
      }

      // 3) Preserve saved state around the import
      const state = !notesApi.hasUnsavedData(props.reportId);
      const msg = await fileApi.load(file);
      notesApi.setSavedState(state, props.reportId);
      setMessage(msg);

      if (props.refetch) {
        await props.refetch();
      }
    } catch (error) {
      setMessage(`Upload failed: ${String(error)}`);
    } finally {
      setUploading(false);
      // Clear the input so selecting the same file again works
      target.value = "";
      // Close modal after upload completes or confirm
      setOpen(false);
    }
  };

  return (
    <>
      <button
        class="button is-info"
        onClick={() => {
          setMessage(null);
          setOpen(true);
        }}
      >
        <span class="icon is-small">
          <i class="fas fa-upload" />
        </span>
      </button>

      {open() && (
        <div
          class="modal is-active"
          onClick={() => {
            if (!uploading()) setOpen(false);
          }}
        >
          <div class="modal-background" />
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <div class="box">
              <h3 class="title is-size-6 mb-2">Upload Notes and Classifications</h3>

              {message() && (
                <div
                  class={
                    message()!.startsWith("Upload failed")
                      ? "notification is-danger is-light"
                      : "notification is-success is-light"
                  }
                >
                  {message()}
                </div>
              )}

              <p class="help is-info mb-3">Select an Excel file with notes and classifications to be loaded.</p>

              <div class="field">
                <div class="control">
                  <label class="button is-primary">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      class="is-hidden"
                      disabled={uploading()}
                    />
                    {uploading() ? "Uploading…" : "Select Excel"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            class="modal-close is-large"
            aria-label="close"
            onClick={() => {
              if (!uploading()) setOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
};
