import { Component, onMount } from "solid-js";
import { useUpload } from "../../utils/upload/useUpload";

export const Upload: Component<{
  reportId: string | null;
  ref?: (trigger: () => void) => void;
}> = (props) => {
  const { trigger, uploading, setInputRef, handleFileSelect } = useUpload(props);

  onMount(() => {
    props.ref?.(trigger);
  });

  return (
    <input
      type="file"
      accept=".xlsx,.xls"
      ref={setInputRef}
      onChange={handleFileSelect}
      class="is-hidden"
      disabled={uploading()}
    />
  );
};
