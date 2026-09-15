import { Component, createSignal } from "solid-js";

/**
 * EMX2 base URL — must go through the Vite proxy path `/emx2` in
 * the browser (see EmxNotesApi.ts / Login.tsx for the same
 * convention).
 */
const EMX2_BASE_URL = "/emx2";

interface GraphQlResponse<T> {
  data?: T;

  errors?: {
    message: string;
  }[];
}

/**
 * Sign-out button for EMX2.
 *
 * Calls EMX2's server-wide (schema-less) `/api/graphql` endpoint —
 * sign-out applies to the whole server session, not a single
 * schema. `credentials: "include"` ensures the session cookie is
 * sent along so the server knows which session to end.
 *
 * NOTE: the exact mutation name/response shape below is my best
 * understanding of EMX2's API, not confirmed against your server.
 * Verify against your server's GraphiQL explorer
 * (`<server>/api/graphql`) and adjust the query if it differs.
 *
 * On success, reloads the page so the rest of the app (which reads
 * the session via `_session { email }`, see EmxNotesApi) picks up
 * the now-signed-out state.
 */
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
    <>
      <a class="navbar-item" onClick={onClick}>
        {submitting() ? "Signing out…" : "Log out"}
      </a>
      {error() && <p class="help is-danger">{error()}</p>}
    </>
  );
};
