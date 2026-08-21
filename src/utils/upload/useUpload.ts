import { createSignal } from "solid-js";
import { getNotesApi } from "../../api/NotesApiFactory";
import { createFileApi } from "../../api/FileApi";
import { notifyDataChanged } from "./uploadSignal";

const notesApi = getNotesApi();
const fileApi = createFileApi(notesApi);

export function useUpload(props: { reportId: string | null }) {
  const [uploading, setUploading] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  let inputRef: HTMLInputElement | undefined;

  const setInputRef = (el: HTMLInputElement) => {
    inputRef = el;
  };

  const trigger = () => {
    if (uploading()) return;
    setMessage(null);
    inputRef?.click();
  };

  const handleFileSelect = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    setMessage(null);

    if (!file) return;

    if (!props.reportId) {
      setMessage("Upload failed: report is not ready yet.");
      target.value = "";
      return;
    }

    setUploading(true);
    try {
      const reportIdFromFile = await fileApi.getReportIdFromFile(file);

      if (reportIdFromFile !== props.reportId) {
        const proceed = window.confirm(
          `The selected file belongs to a different report.\n\n` + `Do you want to continue importing anyway?`,
        );
        if (!proceed) {
          setUploading(false);
          target.value = "";
          return;
        }
      }

      const state = !notesApi.hasUnsavedData(props.reportId);
      const msg = await fileApi.load(file, props.reportId);
      notesApi.setSavedState(state, props.reportId);
      setMessage(msg);

      notifyDataChanged();
    } catch (error) {
      setMessage(`Upload failed: ${String(error)}`);
    } finally {
      setUploading(false);
      target.value = "";
    }
  };

  return { trigger, uploading, message, setInputRef, handleFileSelect };
}
