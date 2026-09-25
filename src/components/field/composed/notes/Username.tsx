import { Component, Show, createSignal, onCleanup, onMount } from "solid-js";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import { stripOuterQuotes } from "../../../../api/NotesApi.utils";
import { Logout } from "../../../Logout";

const USERNAME_RETRY_INTERVAL_MS = 200;

export const Username: Component<{
  showLogout: boolean;
}> = (props) => {
  const notesApi = getNotesApi();

  const [username, setUsername] = createSignal<string | undefined>(
    stripOuterQuotes(notesApi.getCurrentUserName()) as string | undefined,
  );

  onMount(() => {
    if (username() !== undefined) {
      return;
    }

    const intervalId = setInterval(() => {
      const current = stripOuterQuotes(notesApi.getCurrentUserName()) as string | undefined;

      if (current !== undefined) {
        setUsername(current);
        clearInterval(intervalId);
      }
    }, USERNAME_RETRY_INTERVAL_MS);

    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <>
      <span>
        <b>Username:</b> {username()}
      </span>
      <Show when={props.showLogout}>
        <Logout />
      </Show>
    </>
  );
};
