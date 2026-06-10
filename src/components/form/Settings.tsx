import { Component, createSignal } from "solid-js";
import { createNotesApi } from "../../api/DefaultNotesApi";
import type { ReportId } from "../../types/NotesApi";

const notesApi = createNotesApi();

export const Settings: Component<{
  reportId: ReportId;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [busy, setBusy] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);

  const clearReportData = async () => {
    try {
      setBusy(true);
      setMessage(null);

      // Remove notes and classifications for this reportId
      const notesKey = `notes_${props.reportId}`;
      const classificationsKey = `classifications_${props.reportId}`;

      console.log("REMOVE!");
      console.log(notesKey);
      console.log(classificationsKey);
      localStorage.removeItem(notesKey);
      localStorage.removeItem(classificationsKey);
      console.log("REMOVED!");
      setMessage("All notes and classifications for this report have been deleted from browser storage.");
    } catch (error) {
      setMessage(`Failed to delete data: ${String(error)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        class="button is-info"
        title={props.title}
        onClick={() => setOpen(true)}
      >
        <span class="icon is-small">
          <i class="fas fa-cog" />
        </span>
      </button>

      {open() && (
        <div class="modal is-active" onClick={() => setOpen(false)}>
          <div class="modal-background" />
          {/* prevent inner clicks from closing */}
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <div class="box">
              <h3 class="title is-size-6 mb-2">Clear browser data</h3>
              <p class="help is-warning mb-3">
                Clear all notes and classifications from the browser storage.
              </p>
              <p class="help is-danger mb-4">
                This action only affects this report and cannot be undone.
              </p>

              <button
                class="button is-danger is-fullwidth"
                onClick={clearReportData}
                disabled={busy()}
              >
                Delete data
              </button>

              {message() && (
                <p
                  class={
                    message()!.startsWith("Failed")
                      ? "help is-danger mt-3"
                      : "help is-success mt-3"
                  }
                >
                  {message()}
                </p>
              )}
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
};