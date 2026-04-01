import { Component, createResource, For, Show } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";

type VIPInfoRow = {
  classification?: string | null;
  mg_updatedBy?: string | null;
  mg_updatedOn?: string | null;
};

export const ClassificationViewer: Component<{ rd3: CellValueRD3 }> = (props) => {
  const [rows] = createResource<VIPInfoRow[]>(async () => {
    const id = `${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}`;

    const res = await fetch("/RD3/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            VIPInfo(filter: { variant: { equals: "${id}" }, reportId: { not_equals: "${props.rd3.report}" }, classification: { not_equals: "-" } }) {
              classification
              mg_updatedBy
              mg_updatedOn
            }
          }
        `,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data?.data?.VIPInfo ?? [];
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
    <div>
      <Show when={!rows.loading}>
        <Show when={(rows() ?? []).length > 0} fallback={<p>No classifications found.</p>}>
          <table class="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Classification</th>
                <th>Updated by</th>
                <th>Updated on</th>
              </tr>
            </thead>
            <tbody>
              <For each={rows() ?? []}>
                {(row) => (
                  <tr>
                    <td>{row.classification ?? "-"}</td>
                    <td>{row.mg_updatedBy ?? "-"}</td>
                    <td>({formatDate(row.mg_updatedOn ?? "-")})</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
      </Show>

      <Show when={rows.loading}>
        <p>Loading...</p>
      </Show>

      <Show when={rows.error}>
        <p class="has-text-danger">Error loading data: {String(rows.error)}</p>
      </Show>
    </div>
  );
};
