import { Component, Show } from "solid-js";
import { ClassificationOption } from "../../../../types/NotesApi";
import { Select } from "../../../form/Select";

type NotesFormProps = {
  userClassification: {
    report: string;
    options?: ClassificationOption[];
    s?: { item: { data: { person: { individualId?: string } } } };
    c: string;
    p: number;
    r: string;
    a: string | null;
    end?: number;
    feature: string;
    hgvsC?: string;
    hgvsP?: string;
    ru?: string;
    ruNr?: number;
  };
  classificationOptions: ClassificationOption[];
  value: ClassificationOption;
  onClassificationChange: (val: string) => void;
  username: string;
  setUsername: (v: string) => void;
  isSetUsernameEnabled: boolean;
  noteValue: string;
  setNoteValue: (v: string) => void;
  onSaveNote: () => void;
  disabled: boolean;
};

export const NotesForm: Component<NotesFormProps> = (props) => {
  return (
    <>
      <div>
        <b>Classification:</b>{" "}
        <Select
          placeholder={"Select classification"}
          value={props.value.value}
          options={
            props.classificationOptions?.map((option) => ({
              id: option.value,
              label: option.label,
            })) ?? []
          }
          onValueChange={(e) => props.onClassificationChange(e.value)}
          disabled={props.disabled}
        />
      </div>

      <hr />

      <header class="notes-modal-header">
        <h2 class="notes-modal-title">Notes</h2>
      </header>

      <Show when={props.isSetUsernameEnabled}>
        <div class="field">
          <div class="is-flex is-align-items-center">
            <label class="label mr-2">Name:</label>
            <div class="control">
              <input
                type="text"
                class="input"
                value={props.username}
                onInput={(e) => props.setUsername(e.currentTarget.value)}
                placeholder="Enter your name (optional)"
                disabled={props.disabled}
              />
            </div>
          </div>
        </div>
      </Show>

      <div class="field has-addons">
        <div class="control is-expanded">
          <textarea
            rows={2}
            cols={50}
            value={props.noteValue}
            onInput={(e) => props.setNoteValue(e.currentTarget.value)}
            class="textarea"
            placeholder="Enter your note"
            disabled={props.disabled}
          />
          <br />
          <button class="button is-primary ml-2" onClick={() => props.onSaveNote()} disabled={props.disabled}>
            Add note
          </button>
        </div>
      </div>
    </>
  );
};
