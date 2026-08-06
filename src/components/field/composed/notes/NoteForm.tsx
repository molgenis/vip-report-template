import { Component, Show } from "solid-js";

type NoteFormProps = {
  showUsernameField: boolean;
  username: string;
  onUsernameChange: (value: string) => void;
  noteValue: string;
  onNoteValueChange: (value: string) => void;
  onSave: () => void;
  disabled: boolean;
};

export const NoteForm: Component<NoteFormProps> = (props) => {
  return (
    <>
      <Show when={props.showUsernameField}>
        <div class="field">
          <div class="is-flex is-align-items-center">
            <label class="label mr-2">Name:</label>
            <div class="control">
              <input
                type="text"
                class="input"
                value={props.username}
                onInput={(e) => props.onUsernameChange(e.currentTarget.value)}
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
            rows="2"
            cols="50"
            value={props.noteValue}
            onInput={(e) => props.onNoteValueChange(e.currentTarget.value)}
            class="textarea"
            placeholder="Enter your note"
            disabled={props.disabled}
          />
          <br />
          <button class="button is-primary ml-2" onClick={props.onSave} disabled={props.disabled}>
            Add note
          </button>
        </div>
      </div>
    </>
  );
};
