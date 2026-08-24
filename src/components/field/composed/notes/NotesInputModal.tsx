import { Component, createEffect, JSX } from "solid-js";
import { CellValueUserClassification } from "../../../../types/configCellComposed";

type NotesInputModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
  userClassification: CellValueUserClassification;
  title: string;
};

export const NotesInputModal: Component<NotesInputModalProps> = (props) => {
  let contentRef: HTMLDivElement | undefined;

  const setContentRef = (el: HTMLDivElement) => {
    contentRef = el;
  };

  createEffect(() => {
    if (props.isOpen && contentRef) {
      contentRef.scrollTop = 0;
    }
  });

  return (
    <div class="modal notes-modal" classList={{ "is-active": props.isOpen }}>
      <div class="modal-background" onClick={() => props.onClose()} />
      <div ref={setContentRef} class="notes-modal-content" onClick={(e) => e.stopPropagation()}>
        <button class="modal-close is-large" aria-label="close" type="button" onClick={() => props.onClose()} />

        <header class="notes-modal-header">
          <h2 class="notes-modal-title">{props.title}</h2>
        </header>
        {props.children}
      </div>
    </div>
  );
};
