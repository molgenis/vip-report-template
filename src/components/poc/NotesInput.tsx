import {
  Component,
  createEffect,
  createSignal,
  JSX,
  Show,
  For,
} from "solid-js";
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
  onAltIndexChange: (index: number) => void;
};

export const NotesInput: Component<NotesInputProps> = (props) => {
  let contentRef: HTMLDivElement | undefined;

  const setContentRef = (el: HTMLDivElement) => {
    contentRef = el;
  };

  createEffect(() => {
    if (props.open && contentRef) {
      contentRef.scrollTop = 0;
    }
  });

  const commaSeparatedAlts = (alts: string[]) => {
    return (
      <>
        {alts.map((item, index) => (
          <span>
            {item.length > 5 ? (
              <abbr title={item}>{item.slice(0, 5)}…</abbr>
            ) : (
              item
            )}
            {index < alts.length - 1 ? ", " : ""}
          </span>
        ))}
      </>
    );
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
            ref={setContentRef}
            style={{
              background: "#fff",
              padding: "1rem",
              "border-radius": "8px",
              "max-width": "800px",
              width: "100%",
              position: "relative",
              "max-height": "80vh",
              "overflow-y": "auto",
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
              <h2 style={{ margin: 0, "font-size": "1.25rem" }}>
                <b>Variant:</b>{" "}
                {props.variantKey.r.data.c}:{props.variantKey.r.data.p}{" "}
                <b>Reference:</b> {props.variantKey.r.data.r}{" "}
                <b>Alternatives:</b>{" "}
                {commaSeparatedAlts(props.variantKey.r.data.a)}
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
              <b>Warning:</b> Classification and notes are stored in browser storage
              and will be deleted if browser data is cleared.
            </div>

            <Show when={props.variantKey.r.data.a.length > 1}>
              <div style={{ "margin-bottom": "0.5rem" }}>
                <label>
                  <b>Select alt allele:</b>{" "}
                  <select
                    value={props.altIndex}
                    onChange={(e) =>
                      props.onAltIndexChange(
                        Number(e.currentTarget.value),
                      )
                    }
                  >
                    <For each={props.variantKey.r.data.a}>
                      {(alt, i) => (
                        <option value={i()}>
                          {alt.length > 5
                            ? `${alt.slice(0, 5)}…`
                            : alt}
                        </option>
                      )}
                    </For>
                  </select>
                </label>
              </div>
            </Show>

            {props.children}

            <div class="control">
              <button class="button is-primary ml-2" onClick={props.onClose}>
                Close
              </button>
            </div>
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
  const [altIndex, setAltIndex] = createSignal(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const showPopup = () => {
    setAltIndex(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refresh();
  };

  return (
    <>
      <span>
        <button onClick={showPopup}>
          <i class="fas fa-edit"></i>
        </button>

        <Comment
          rd3={props.variant}
          refresh={refreshKey()}
          callback={showPopup}
        />

        <ClassificationViewer
          rd3={props.variant}
          refresh={refreshKey()}
        />
      </span>

      <NotesInput
        open={open()}
        onClose={handleClose}
        variantKey={props.variant}
        altIndex={altIndex()}
        onAltIndexChange={setAltIndex}
      >
        <br />

        <Classification
          rd3={props.variant}
          altIndex={altIndex()}
        />

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