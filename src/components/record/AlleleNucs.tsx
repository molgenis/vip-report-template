import { Component, For } from "solid-js";

const Nucs: Component<{ bases: string[] }> = (props) => {
  return (
    <For each={props.bases}>
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
  );
};

export const AlleleNucs: Component<{ values: string[]; isAbbreviate: boolean }> = (props) => {
  const abbreviate = (): boolean => props.values.length > 4 && props.isAbbreviate;

  const nucs = (): string[] => {
    let nucs = props.values;
    if (abbreviate()) {
      const lastNuc = nucs[nucs.length - 1];
      nucs = nucs.slice(0, 2);
      nucs.push("\u2026"); // ellipsis
      nucs.push(lastNuc);
    }
    return nucs;
  };

  return (
    <>
      {abbreviate() ? (
        <abbr title={props.values.join("")}>
          <Nucs bases={nucs()} />
        </abbr>
      ) : (
        <Nucs bases={nucs()} />
      )}
    </>
  );
};
