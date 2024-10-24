import { Component, For, Show } from "solid-js";
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
    props.value.hpos.map((hpoTermId) => ({
      id: hpoTermId,
      href: `https://hpo.jax.org/app/browse/term/${encodeURI(hpoTermId)}`,
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
      <Show when={gadoPd() === "LC"} keyed>
        <abbr
          title="Gene phenotype relation predicted by GADO with low confidence; Z-Score greater than 3 but below 5."
          class="ml-1 is-clickable"
        >
          <i class="fas fa-question-circle has-text-info" />
        </abbr>
      </Show>
      <Show when={gadoPd() === "HC"} keyed>
        <abbr
          title="Gene phenotype relation predicted by GADO with high confidence; Z-Score greater than 5."
          class="ml-1 is-clickable"
        >
          <i class="fas fa-info-circle has-text-info" />
        </abbr>
      </Show>
    </>
  );
};
