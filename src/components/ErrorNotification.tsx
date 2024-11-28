import { Component, createEffect } from "solid-js";

// renamed from Error to avoid naming conflict with JavaScript error
export const ErrorNotification: Component<{
  error: unknown;
}> = (props) => {
  createEffect(() => console.error(props.error));
  return <div class="notification is-danger is-light">An unexpected error occurred</div>;
};
