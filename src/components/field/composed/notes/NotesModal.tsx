import { Component, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { CellValueUserClassification } from "../../../../types/configCellComposed";

type NotesModalProps = {
  open: boolean;
  onClose: () => void;
  onDismissSaved: () => void;
  userClassification: CellValueUserClassification;
  classificationSaved: boolean;
  children: JSX.Element;
};

export const NotesModal: Component<NotesModalProps> = (props) => {
  let contentRef: HTMLDivElement | undefined;

  const setContentRef = (el: HTMLDivElement) => {
    contentRef = el;
  };

  // Scroll to top when opened
  const onOpen = () => {
    if (contentRef) {
      contentRef.scrollTop = 0;
    }
  };

  const headerTitle = () => {
    const { feature, hgvsC, hgvsP, svType, ru, ruNr } = props.userClassification;

    if (svType === "STR") {
      return (
        <>
          {feature} (<b>Repeat unit:</b> {ru} <b>Number of units:</b> {ruNr})
        </>
      );
    }

    return `${feature}:${hgvsC}(${hgvsP})`;
  };

  const isRuNrError = () => props.userClassification.ruNr === -1;

  return (
    <Show when={props.open}>
      <Portal>
        <div class="notes-modal-overlay" onClick={() => props.onClose()}>
          <div ref={setContentRef} class="notes-modal-content" onClick={(e) => e.stopPropagation()} onMount={onOpen}>
            <header class="notes-modal-header">
              <h2 class="notes-modal-title">{headerTitle()}</h2>
            </header>

            <Show when={isRuNrError()}>
              <div class="notification is-danger is-light mt-2">
                This tandem repeat allele was not observed for this sample.
              </div>
            </Show>

            <button onClick={() => props.onClose()} class="notes-modal-close">
              ×
            </button>

            <Show when={props.classificationSaved}>
              <div class="notification is-success is-light is-flex is-justify-content-space-between is-align-items-center">
                <span>Classification saved successfully.</span>
                <button class="notes-modal-close" type="button" onClick={() => props.onDismissSaved()}>
                  ×
                </button>
              </div>
            </Show>

            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};
