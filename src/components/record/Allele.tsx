import { Component, createMemo, For } from "solid-js";
import { Abbr } from "../Abbr";

export const Allele: Component<{ value: string | null; isAbbreviate: boolean }> = (props) => {
  const missing = () => props.value === null;
  const symbolic = createMemo(() => props.value?.startsWith("<") && props.value?.endsWith(">"));
  const breakend = createMemo(
    () => props.value?.indexOf("[") !== -1 || props.value?.indexOf("]") !== -1 || props.value?.indexOf(".") !== -1
  );

  function nucs(value: string) {
    let nucleotides = value.split("");
    if (nucleotides.length > 4 && props.isAbbreviate) {
      const lastNuc = nucleotides[nucleotides.length - 1];
      nucleotides = nucleotides.slice(0, 2);
      nucleotides.push("\u2026"); // ellipsis
      nucleotides.push(lastNuc);
    }
    return nucleotides;
  }

  return (
    <>
      {missing() && <span classList={{ base: true, "base-m": true }}>?</span>}
      {(symbolic() || breakend()) && <span class="base-n">{props.value}</span>}
      {!missing() && !symbolic() && !breakend() && props.isAbbreviate && (props.value as string).length > 4 && (
        <For each={nucs(props.value as string)}>
          {(base) => (
            <Abbr
              title={props.value as string}
              value={base}
              classList={{
                base: true,
                "base-a": base === "A",
                "base-c": base === "C",
                "base-g": base === "G",
                "base-n": base === "N",
                "base-t": base === "T",
              }}
            ></Abbr>
          )}
        </For>
      )}
      {!missing() && !symbolic() && !breakend() && (!props.isAbbreviate || (props.value as string).length <= 4) && (
        <For each={nucs(props.value as string)}>
          {(base) => (
            <span
              classList={{
                base: true,
                "base-a": base === "A",
                "base-c": base === "C",
                "base-g": base === "G",
                "base-n": base === "N",
                "base-t": base === "T",
              }}
            >
              {base}
            </span>
          )}
        </For>
      )}
    </>
  );
};
