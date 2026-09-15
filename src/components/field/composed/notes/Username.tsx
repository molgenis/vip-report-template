import { Component, createSignal } from "solid-js";
import { getNotesApi } from "../../../../api/NotesApiFactory";
import { stripOuterQuotes } from "../../../../api/NotesApi.utils";
import { Logout } from "../../../Logout";

export const Username: Component = () => {
  const notesApi = getNotesApi();
  const [username] = createSignal<string>(stripOuterQuotes(notesApi.getCurrentUserName()) as string);
  return (
    <>
      <span>
        <b>Username:</b> {username()}
      </span>
      <Logout />
    </>
  );
};
