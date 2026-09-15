import { Component, createSignal } from "solid-js";

/**
 * EMX2 base URL — must go through the Vite proxy path `/emx2` in
 * the browser (see EmxNotesApi.ts for the same convention).
 */
const EMX2_BASE_URL = "/emx2";

interface GraphQlResponse<T> {
  data?: T;

  errors?: {
    message: string;
  }[];
}

/**
 * Simple email/password sign-in form for EMX2.
 *
 * Calls EMX2's server-wide (schema-less) `/api/graphql` endpoint —
 * sign-in applies to the whole server session, not a single schema.
 * `credentials: "include"` ensures the session cookie EMX2 sets on
 * success is sent on subsequent requests.
 *
 * NOTE: the exact mutation name/arguments/response shape below are
 * my best understanding of EMX2's API, not confirmed against your
 * server. Verify against your server's GraphiQL explorer
 * (`<server>/api/graphql`) and adjust the query if it differs.
 *
 * On success, reloads the page so the rest of the app (which reads
 * the session via `_session { email }`, see EmxNotesApi) picks up
 * the newly authenticated session.
 */
export const Login: Component = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal<string | undefined>();
  const [submitting, setSubmitting] = createSignal(false);

  const signIn = async (emailValue: string, passwordValue: string) => {
    const url = `${EMX2_BASE_URL.replace(/\/$/, "")}/api/graphql`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        query: `mutation SignIn($email: String, $password: String) {
          signin(email: $email, password: $password) {
            status
            message
          }
        }`,

        variables: {
          email: emailValue,
          password: passwordValue,
        },
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
      signin: { status: string; message?: string };
    }>;

    if (json.errors?.length) {
      throw new Error(json.errors.map((err) => err.message).join("; "));
    }

    if (json.data === undefined) {
      throw new Error("EMX2 GraphQL response contained no data");
    }

    if (json.data.signin.status !== "SUCCESS") {
      throw new Error(json.data.signin.message ?? "Sign in failed");
    }
  };

  const onSubmit = async (event: Event) => {
    event.preventDefault();

    setError(undefined);
    setSubmitting(true);

    try {
      await signIn(email(), password());

      // Simplest way to make sure every part of the app (username
      // display, data queries, etc.) picks up the new session.
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} class="box" style={{ "max-width": "360px", margin: "4rem auto" }}>
      <h1 class="title is-4">Sign in</h1>

      {error() && <div class="notification is-danger is-light">{error()}</div>}

      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            class="input"
            type="string"
            autocomplete="username"
            required
            value={email()}
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
        </div>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            autocomplete="current-password"
            required
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
          />
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit" disabled={submitting()}>
            {submitting() ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </form>
  );
};
