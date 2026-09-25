import { Component, Show, createSignal } from "solid-js";

const EMX2_BASE_URL = import.meta.env.DEV ? "/emx2" : "";

interface GraphQlResponse<T> {
  data?: T;

  errors?: {
    message: string;
  }[];
}

export const Logout: Component = () => {
  const [error, setError] = createSignal<string | undefined>();
  const [submitting, setSubmitting] = createSignal(false);

  const signOut = async () => {
    const url = `${EMX2_BASE_URL.replace(/\/$/, "")}/api/graphql`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        query: `mutation {
          signout {
            status
            message
          }
        }`,
      }),
    });

    if (!response.ok) {
      let errorDetails = "";

      try {
        errorDetails = await response.text();
      } catch {
        // Ignore response-body parsing errors.
      }

      throw new Error(
        `EMX2 GraphQL request failed: ${response.status} ${
          response.statusText
        }${errorDetails ? ` - ${errorDetails}` : ""}`,
      );
    }

    const json = (await response.json()) as GraphQlResponse<{
      signout: { status: string; message?: string };
    }>;

    if (json.errors?.length) {
      throw new Error(json.errors.map((err) => err.message).join("; "));
    }

    if (json.data === undefined) {
      throw new Error("EMX2 GraphQL response contained no data");
    }

    if (json.data.signout.status !== "SUCCESS") {
      throw new Error(json.data.signout.message ?? "Sign out failed");
    }
  };

  const onClick = async () => {
    setError(undefined);
    setSubmitting(true);

    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      setSubmitting(false);
    }
  };

  return (
    <Show when={import.meta.env.DEV}>
      <a class="navbar-item" onClick={onClick}>
        {submitting() ? "Signing out…" : "Log out"}
      </a>
      {error() && <p class="help is-danger">{error()}</p>}
    </Show>
  );
};
