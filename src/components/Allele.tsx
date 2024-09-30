import { Component, createMemo, For, Match, Switch } from "solid-js";
import { ErrorNotification } from "./ErrorNotification";

type AlleleType = "breakend" | "missing" | "symbolic" | "nucs";

export const Allele: Component<{ value: string | null; isAbbreviate: boolean }> = (props) => {
  const type = createMemo((): AlleleType => {
    const value = props.value;
    let type: AlleleType;

    if (value === null) type = "missing";
    else if (value.startsWith("<") && value.endsWith(">")) type = "symbolic";
    else if (value.indexOf("[") !== -1 || value.indexOf("]") !== -1 || value.indexOf(".") !== -1) type = "breakend";
    else type = "nucs";

    return type;
  });

  return (
    <Switch fallback={<ErrorNotification error={`unexpected allele type '${type()}'`} />}>
      <Match when={type() === "breakend"}>
        <AlleleBreakend value={props.value as string} />
      </Match>
      <Match when={type() === "missing"}>
        <AlleleMissing />
      </Match>
      <Match when={type() === "symbolic"}>
        <AlleleSymbolic value={props.value as string} />
      </Match>
      <Match when={type() === "nucs"}>
        <AlleleNucs values={(props.value as string).split("")} isAbbreviate={props.isAbbreviate} />
      </Match>
    </Switch>
  );
};

const AlleleBreakend: Component<{ value: string }> = (props) => {
  return <span class="base-n">{props.value}</span>;
};

const AlleleMissing: Component = () => {
  return <span class="base-n">?</span>;
};

const AlleleSymbolic: Component<{ value: string }> = (props) => {
  return <span class="base-n">{props.value}</span>;
};

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

const AlleleNucs: Component<{ values: string[]; isAbbreviate: boolean }> = (props) => {
  const abbreviate = (): boolean => props.values.length > 4 && props.isAbbreviate;

  const nucs = (): string[] => {
    let nucs = props.values;
    if (abbreviate()) {
      const lastNuc = nucs[nucs.length - 1] as string;
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
