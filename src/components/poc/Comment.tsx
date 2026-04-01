import { Component, createResource } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";

export const Comment: Component<{ rd3: CellValueRD3 }> = (props) => {
  // Fetch initial value from GraphQL
  const [value] = createResource(async () => {
    const id = `${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}:${props.rd3.report}`;
    console.log("ID:"+id);
    const res = await fetch("/RD3/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            VIPNotes(filter: { variant: { equals: "${id}" } }){
              mg_updatedBy,note
            }
          }
        `,
      }),
    });
    const data = await res.json();
    const notes = data?.data?.VIPNotes?.map((item: any) => item.mg_updatedBy + ": " + item.note).filter(Boolean) || [];
    return notes.length ? notes.join("\n") : "-";
  });

  console.log("???");
  return (
    <abbr title={value()} class="ml-1 is-clickable">
      <i class="fas fa-comment has-text-info" />
    </abbr>
  );
};
