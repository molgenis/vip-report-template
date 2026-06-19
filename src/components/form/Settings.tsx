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

      localStorage.removeItem(notesKey);
      localStorage.removeItem(classificationsKey);
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
        onClick={() => setOpen(true)}
      >
        <span class="icon is-small">
          <i class="fas fa-cog" />
        </span>
      </button>

      {open() && (
        <div class="modal is-active" onClick={() => {
          setOpen(false);
          window.location.reload();
        }}>
          <div class="modal-background" />
          {/* prevent inner clicks from closing */}
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <div class="box">
              <h3 class="title is-size-6 mb-2">Clear browser data</h3>
              
        <div class="notification is-danger is-light">
          <b>Warning: </b> This will clear <b>all notes and classifications for this report</b> from the browser storage<br/>
          This can not be undone.
        </div>
        {message() && (
                <div
                  class={
                    message()!.startsWith("Failed")
                      ? "notification is-danger is-light"
                      : "notification is-success is-light"
                  }
                >
                  {message()}
                </div>
              )}

              <button
                class="button is-danger is-fullwidth"
                onClick={clearReportData}
                disabled={busy()}
              >
                Delete data
              </button>
            </div>
          </div>
          <button
            class="modal-close is-large"
            aria-label="close"
            onClick={
                () => {setOpen(false);
                window.location.reload();
              }
            }
          />
        </div>
      )}
    </>
  );
};