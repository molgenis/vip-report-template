import { Component } from "solid-js";

export const Error: Component<{
  error: unknown;
}> = (props) => {
  const error = () => props.error;
  console.error(error());
  return <div class="notification is-danger is-light">An unexpected error occurred</div>;
};
