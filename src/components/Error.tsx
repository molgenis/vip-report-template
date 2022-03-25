import { Component } from "solid-js";

export const Error: Component<{
  error: unknown;
}> = (props) => {
  console.error(props.error);
  return <div class="notification is-danger is-light">An unexpected error occurred</div>;
};
