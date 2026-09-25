import { Component, createEffect, createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { EmxSessionExpiredError } from "../api/EmxNotesApi";
import { Login } from "./Login";

// renamed from Error to avoid naming conflict with JavaScript error
export const ErrorNotification: Component<{
  error: unknown;
}> = (props) => {
  createEffect(() => console.error(props.error));

  const isSessionExpired = () => props.error instanceof EmxSessionExpiredError;

  const [showLogin, setShowLogin] = createSignal(false);

  createEffect(() => {
    if (isSessionExpired()) {
      setShowLogin(true);
    }
  });

  const errorMessage = () => {
    const error = props.error;

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }

    return "An unexpected error occurred";
  };

  return (
    <>
      <Show when={!isSessionExpired()}>
        <div class="notification is-danger is-light">{errorMessage()}</div>
      </Show>

      <Show when={showLogin()}>
        <Portal mount={document.body}>
          <div class="modal is-active" style={{ "z-index": 9999 }}>
            <div class="modal-background" onClick={() => setShowLogin(false)} />
            <div class="modal-content">
              <Login />
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={() => setShowLogin(false)} />
          </div>
        </Portal>
      </Show>
    </>
  );
};
