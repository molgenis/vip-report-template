import { Component, createMemo, Match, Switch } from "solid-js";
import { AlleleBreakend } from "./AlleleBreakend";
import { AlleleMissing } from "./AlleleMissing";
import { AlleleSymbolic } from "./AlleleSymbolic";
import { AlleleNucs } from "./AlleleNucs";

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
    <Switch>
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
