import { Component, createEffect, createResource, createSignal, For, onCleanup } from "solid-js";
import { CellValueRD3 } from "../../types/configCellComposed";

export const Classification: Component<{ rd3: CellValueRD3 }> = (props) => {
  const OPTIONS = ["-", "B", "LB", "VUS", "LP", "P"] as const;
  type Option = (typeof OPTIONS)[number];

  // Fetch initial value from GraphQL (typed as string)
  const [initialValue] = createResource<string>(async () => {
    const id = `${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}:${props.rd3.report}`;
    const res = await fetch("/RD3/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          VIPInfo(filter: { id: { equals: "${id}" } }){
            classification
          }
        }
      `,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data?.data?.VIPInfo?.[0]?.classification || "-";
  });

  const [value, setValue] = createSignal<string>("-");

  createEffect(() => {
    const val = initialValue();
    if (val && OPTIONS.includes(val as Option)) {
      setValue(val);
    }
  });

  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedSave = async (newValue: string) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(async () => {
      try {
        const res = await fetch("/RD3/graphql", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation {
                save(VIPInfo: { 
                  id: "${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}:${props.rd3.report}", 
                  variant: "${props.rd3.c}:${props.rd3.p}:${props.rd3.a}:${props.rd3.s}", 
                  reportId: "${props.rd3.report}",
                  vipId: "${props.rd3.id}",
                  sampleId: "${props.rd3.s}",
                  classification: "${newValue}" 
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
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }, 500);
  };

  // Debounce on value change
  createEffect(() => {
    debouncedSave(value());
  });

  // Cleanup timeout
  onCleanup(() => {
    if (timeout) clearTimeout(timeout);
  });

  return (
    <select value={value()} onChange={(e) => setValue(e.currentTarget.value as Option)} disabled={initialValue.loading}>
      <For each={OPTIONS}>{(opt) => <option value={opt}>{opt}</option>}</For>
    </select>
  );
};;
