import {
  Component,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";
import { createNotesApi } from "../../api/NotesApiFactory";
import { retrieveNotesForVariant } from "../../api/NotesApi.utils";
import { formatDate } from "../../utils/config/dateUtils";

const notesApi = createNotesApi();

export const CommentEditor: Component<{
  rd3: CellValueRD3;
  altIndex: number;
  callback: () => void;
}> = (props) => {
  const [filterOnAlt, setFilterOnAlt] = createSignal(true);

  const variantKey = () => ({
    Chromosome: props.rd3.r.data.c,
    Position: props.rd3.r.data.p,
    Reference: props.rd3.r.data.r,
    Alternative: props.rd3.r.data.a[props.altIndex],
    RU_NR: undefined,
    RU: undefined,
    END: undefined,
  });

  const reportId = () => props.rd3.report;
  const sampleId = () => props.rd3.s;

  const [notes, { refetch }] = createResource(
    () => ({
      vk: variantKey(),
      reportId: reportId(),
      filterOnAlt: filterOnAlt(),
    }),
    async (src) => {
      return retrieveNotesForVariant(
        notesApi,
        src.vk,
        src.reportId,
        props.rd3.s,//FIXME
        src.filterOnAlt,
      );
    },
  );

  const [value, setValue] = createSignal("");

  const save = async () => {
    try {
      if (!value().trim()) return;

      await notesApi.storeNote({
        id: undefined,
        content: value(),
        variantKey: variantKey(),
        reportId: reportId(),
        sampleId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: undefined,
      });

      await refetch();
      setValue("");
      props.callback();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const remove = async (id: string) => {
    try {
      await notesApi.removeNote(id, sampleId(), reportId());
      await refetch();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  return (
    <>
      <div class="field has-addons">
        <div class="control is-expanded">
          <textarea
            rows="2"
            cols="50"
            value={value()}
            onInput={(e) => setValue(e.currentTarget.value)}
            class="textarea"
          />
        </div>

        <div class="control">
          <button class="button is-primary ml-2" onClick={save}>
            Add
          </button>
        </div>
      </div>

      <Show when={props.rd3.r.data.a.length > 1}>
      <div style={{ "margin-bottom": "0.5rem" }}>
        <label>
          <input
            type="checkbox"
            checked={filterOnAlt()}
            onChange={(e) =>
              setFilterOnAlt(e.currentTarget.checked)
            }
          />
          {" "}Filter notes by ALT allele
        </label>
      </div>
      </Show>
      <Show when={!notes.loading && notes()}>
        <div class="mt-3">
          <For each={notes() ?? []}>
            {(note) => (
              <div class="box has-background-light mb-2 p-3">
                <div class="is-flex is-justify-content-space-between is-align-items-start">
                  <div>
                    <span class="heading is-size-6 has-text-weight-semibold mb-1">
                      (Alt: {note.variantKey.Alternative})
                    </span>
                    <span class="is-size-6 is-italic mb-1">
                      {" "}
                      ({formatDate(note.updatedAt)})
                    </span>
                  </div>

                  <button
                    class="button is-small is-danger is-light"
                    onClick={() => remove(note.id)}
                  >
                    Remove note
                  </button>
                </div>

                <div>{note.content}</div>
              </div>
            )}
          </For>

          <Show when={(notes()?.length ?? 0) === 0}>
            <p class="has-text-grey-light">No notes.</p>
          </Show>
        </div>
      </Show>

      <Show when={notes.error}>
        <p class="help is-danger">
          Error loading notes: {String(notes.error)}
        </p>
      </Show>
    </>
  );
};