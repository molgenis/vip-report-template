import { Component, createSignal, JSX, Show, For } from "solid-js";
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
  variantKey: CellValueRD3;
  altIndex: number;
};

const [altIndex, setAltIndex] = createSignal(0);

export const NotesInput: Component<NotesInputProps> = (props) => {
  const commaSeparatedAlts = (alts: string[]) => {
    const parts = alts.map((item, index) => {
      const content =
        item.length > 5 ? (
          <abbr title={item}>{item.slice(0, 5)}…</abbr>
        ) : (
          item
        );

      // add comma except after last element
      return (
        <span>
          {content}
          {index < alts.length - 1 ? ", " : ""}
        </span>
      );
    });

    return <>{parts}</>;
  };

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
            <header
              style={{
                "border-bottom": "1px solid #ddd",
                "margin-bottom": "1rem",
                padding: "0 0 0.5rem 0",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  "font-size": "1.25rem",
                }}
              >
                <b>Variant:</b> {props.variantKey.r.c}:{props.variantKey.r.p}{" "}
                <b>Reference:</b> {props.variantKey.r.r}{" "}
                <b>Alternatives:</b> {commaSeparatedAlts(props.variantKey.r.a)}
              </h2>
            </header>
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
            <div class="notification is-warning is-light">
          <b>Warning: </b> Classification and notes are stored in browser storage
          and will be deleted if browser data is cleared. Please download them to
          keep them safe.
        </div>
            <Show when={props.variantKey.r.a.length > 1}>
                <div style={{ "margin-bottom": "0.5rem" }}>
                  <label>
                    <b>Selected alternative:</b>{" "}
                    <select
                      value={props.altIndex}
                      onChange={(e) =>
                        setAltIndex(Number((e.currentTarget as HTMLSelectElement).value))
                      }
                    >
                      <For each={props.variantKey.r.a}>
                        {(alt, i) => (
                          <option value={i()}>
                            {alt.length > 5 ? `${alt.slice(0, 5)}…` : alt}
                          </option>
                        )}
                      </For>
                    </select>
                  </label>
                </div>
              </Show>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

type NotesInputButtonProps = {
  variant: CellValueRD3;
};

export const NotesInputButton: Component<NotesInputButtonProps> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [refreshKey, setRefreshKey] = createSignal(0);
  const handleClose = () => {
    setOpen(false);
    refresh();
  };

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <span>
        <button onClick={() => setOpen(true)}>
          <span>
            <i class="fas fa-edit"></i>
          </span>
        </button>
        <Comment rd3={props.variant} refresh={refreshKey()} altIndex={altIndex()} />
        <ClassificationViewer
          rd3={props.variant}
          refresh={refreshKey()}
          altIndex={altIndex()}
        />
      </span>
      <NotesInput open={open()} onClose={handleClose} variantKey={props.variant} altIndex={altIndex()}>
        <br />
        <b>Classification:</b> <Classification rd3={props.variant} altIndex={altIndex()} />
        <br />
        <b>Notes:</b>
        <br />
        <CommentEditor
          rd3={props.variant}
          altIndex={altIndex()}
          callback={refresh}
        />
      </NotesInput>
    </>
  );
};