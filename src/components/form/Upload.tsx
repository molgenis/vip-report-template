import { Component, createSignal, Show } from "solid-js";
import { createNotesApi } from "../../api/DefaultNotesApi";
import { createFileApi } from "../../api/FileApi";

const notesApi = createNotesApi();
const fileApi = createFileApi(notesApi);

export const Upload: Component<{
  refetch?: () => Promise<void>;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [message, setMessage] = createSignal<string | null>(null);

  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    setSelectedFile(file);
    setMessage(null);
  };

  const upload = async () => {
    const file = selectedFile();
    if (!file) return;

    try {
      const message = await fileApi.load(file);
      setMessage(message);
      if (props.refetch) {
        await props.refetch();
      }
      setSelectedFile(null);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.value = "";
    } catch (error) {
      setMessage(`Upload failed: ${error}`);
    }
  };

  return (
    <>
      <button
        class="button is-info"
        onClick={() => setOpen(true)}
      >
        <span class="icon is-small">
          <i class="fas fa-upload" />
        </span>
      </button>

      {open() && (
        <div class="modal is-active" onClick={() => {
          setOpen(false);
          window.location.reload();
        }}>
          <div class="modal-background" />
          {/* stop click bubbling from content */}
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <div class="box">
              <h3 class="title is-size-6 mb-2">Upload Notes and Classifications</h3>
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
              <p class="help is-info mb-3">
                Select an excel file with notes and classifications to be loaded.
              </p>

              <div class="field has-addons mt-2">
                <div class="control">
                  <label class="button is-primary">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      class="is-hidden"
                    />
                    {selectedFile() ? selectedFile()!.name : "Select Excel"}
                  </label>
                </div>
                <div class="control">
                  <button
                    class="button is-success ml-2"
                    onClick={upload}
                    disabled={!selectedFile()}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            class="modal-close is-large"
            aria-label="close"
            onClick={
              () => {setOpen(false);
            }
          }
          />
        </div>
      )}
    </>
  );
};