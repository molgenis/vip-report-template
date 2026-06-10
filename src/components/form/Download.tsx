import { Component, createSignal } from "solid-js";

export const Download: Component<{ 
  onClickVcf: () => void;
  onClickNotes: () => void;
}> = (props) => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <button
        class="button is-info"
        title={"Download VCF file or notes excel file."}
        onClick={() => setOpen(true)}
      >
        <span class="icon is-small">
          <i class="fas fa-download" />
        </span>
      </button>

      {open() && (
        <div class="modal is-active" onClick={() => setOpen(false)}>
          <div class="modal-background" />
          <div class="modal-content">
            <div class="box">
              <a
                class="button is-block is-fullwidth is-primary"
                onClick={() => {
                  props.onClickVcf();
                  setOpen(false);
                }}
              >
                Download VCF
              </a>
              <a
                class="button is-block is-fullwidth is-info"
                style="margin-top: 0.5rem"
                onClick={() => {
                  console.log("Clicked!");
                  props.onClickNotes();
                  setOpen(false);
                }}
              >
                Download notes and classifications
              </a>
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