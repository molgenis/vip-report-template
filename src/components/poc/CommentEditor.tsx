import { Component, createResource, createSignal, For, Show } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";

interface VIPNote {
  mg_updatedBy: string;
  mg_updatedOn: string;
  note: string;
}
export const CommentEditor: Component<{ rd3: CellValueRD3 }> = (props) => {
  const [notes, { refetch }] = createResource<VIPNote[]>(async () => {
    const id = `${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}`;
    const res = await fetch("/RD3/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          VIPNotes(filter: { variant: { equals: "${id}" }, reportId: {equals: "${props.rd3.report}"} }){
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

  const [value, setValue] = createSignal<string>("");

  const save = async () => {
    try {
      const res = await fetch("/RD3/graphql", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              insert(VIPNotes: { 
                id: "${crypto.randomUUID()}"
                variant: "${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}", 
                reportId: "${props.rd3.report}",
                vipId: "${props.rd3.id}",
                sampleId: "${props.rd3.s}",
                note: "${value()}" 
              }) { 
                message 
              }
            }
          `,
        }),
      });

      if (!res.ok) {
        console.error("GraphQL error:", await res.text());
        return;
      }

      const data = await res.json();
      console.log("GraphQL result:", data);

      setValue(""); // Clear input
      await refetch(); // Refresh notes list
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
  console.log("reportID: " + props.rd3.report);
  return (
    <>
      <div class="field has-addons">
        <div class="control">
          <textarea rows="2" cols="50" onInput={(e) => setValue(e.currentTarget.value)} class="textarea" />
        </div>
        <div class="control">
          <button class="button is-primary ml-2" onClick={save}>
            Save
          </button>
        </div>
      </div>
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
