import { Component, createResource, createSignal, For, Show } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";

interface VIPNote {
  mg_updatedBy: string;
  mg_updatedOn: string;
  note: string;
}
export const CommentViewer: Component<{ rd3: CellValueRD3 }> = (props) => {
  const [notes] = createResource<VIPNote[]>(async () => {
    const id = `${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}`;
    const res = await fetch("/RD3/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          VIPNotes(filter: { variant: { equals: "${id}" }, reportId: {not_equals: "${props.rd3.report}"} }){
            mg_updatedBy
            mg_updatedOn
            note
          }
        }
      `,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data?.data?.VIPNotes || []; // Fixed: VIPNotes array
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <>
      <Show when={!notes.loading && notes()}>
        <div class="mt-3">
          <For each={notes()}>
            {(note) => (
              <div class="box has-background-light mb-2 p-3">
                <div>
                  <span class="heading is-size-6 has-text-weight-semibold mb-1">{note.mg_updatedBy} </span>
                  <span class="is-size-6 has-text-weight-italic mb-1"> ({formatDate(note.mg_updatedOn)})</span>
                </div>
                <div>{note.note}</div>
              </div>
            )}
          </For>
          <Show when={notes()?.length === 0}>
            <p class="has-text-grey-light">No comments.</p>
          </Show>
        </div>
      </Show>
      <Show when={notes.error}>
        <p class="help is-danger">Error loading comments: {notes.error()?.message}</p>
      </Show>
    </>
  );
};
