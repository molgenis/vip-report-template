import { Component, createSignal, JSX, Show, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { Classification } from "./Classification";
import { CommentEditor } from "./CommentEditor";
import { Comment } from "./Comment";
import { CellValueRD3 } from "../../types/configCellComposed";
import { ClassificationViewer } from "./ClassificationViewer";

type NotesInputProps = {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
};

export const NotesInput: Component<NotesInputProps> = (props) => {
  return (
    <Show when={props.open}>
      <Portal>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "z-index": 9999,
          }}
          onClick={props.onClose}
        >
          <div
            style={{
              background: "#fff",
              padding: "1rem",
              "border-radius": "8px",
              "max-width": "800px",
              width: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={props.onClose}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                "font-size": "1.2rem",
              }}
            >
              ×
            </button>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

type NotesInputButtonProps = {
  variantKey: CellValueRD3;
};

export const NotesInputButton: Component<NotesInputButtonProps> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [refreshKey, setRefreshKey] = createSignal(0);

  const handleClose = () => {
    setOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <span>
        <button onClick={() => setOpen(true)}>
          <span><i class="fas fa-edit"></i></span>
        </button>
        <Comment rd3={props.variantKey} refresh={refreshKey()} /> 
        <ClassificationViewer rd3={props.variantKey} refresh={refreshKey()} />
      </span>
      <NotesInput open={open()} onClose={handleClose}>
        <br />
        <div class="notification is-warning is-light">
          <b>Warning: </b> Classification and notes are stored in browser storage and will be deleted if browser data is cleared. Please download them to keep them safe.
        </div>
        <b>Classification:</b> <Classification rd3={props.variantKey} />
        <br />
        <b>Notes:</b><br />
        <CommentEditor rd3={props.variantKey} />
      </NotesInput>
    </>
  );
};