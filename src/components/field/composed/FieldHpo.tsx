import { Component, For, Match, Show, Switch } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldString } from "../typed/FieldString";
import { CellValueHpo } from "../../../types/configCellComposed";

type HpoTerm = {
  id: string;
  href: string;
};

export const FieldHpo: Component<{
  value: CellValueHpo;
}> = (props) => {
  const hpoTerms = (): HpoTerm[] =>
    props.value.hpos.map((category) => ({
      id: category!.value!,
      href: `https://hpo.jax.org/app/browse/term/${encodeURI(category!.value!)}`,
    }));

  const gadoPd = () => props.value.gadoPd || null;

  return (
    <>
      <For each={hpoTerms()}>
        {(hpoTerm, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <Anchor href={hpoTerm.href}>
              <FieldString value={hpoTerm.id} />
            </Anchor>
          </>
        )}
      </For>
      <Show when={gadoPd()}>
        {(gadoPd) => (
          <abbr title={gadoPd().description} class="ml-1 is-clickable">
            <Switch>
              <Match when={gadoPd().value === "LC"}>
                <i class="fas fa-question-circle has-text-info" />
              </Match>
              <Match when={gadoPd().value === "HC"}>
                <i class="fas fa-info-circle has-text-info" />
              </Match>
            </Switch>
          </abbr>
        )}
      </Show>
    </>
  );
};
