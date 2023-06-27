import { Component, createMemo, For, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";
import { FieldValueString } from "../field/FieldValueString";

type HpoTerm = {
  id: string;
  href: string;
};

export const Hpo: Component<FieldProps> = (props) => {
  const hpoTerms = (): HpoTerm[] =>
    (props.info.value as string[]).map((hpoTermId) => ({
      id: hpoTermId,
      href: `https://hpo.jax.org/app/browse/term/${encodeURI(hpoTermId)}`,
    }));

  const gadoIndex = getCsqInfoIndex(props.infoMeta, "GADO_CL");
  const gadoClass = gadoIndex != -1 ? (getCsqInfo(props.info, gadoIndex) as string) : null;

  return (
    <>
      <For each={hpoTerms()}>
        {(hpoTerm, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <Anchor href={hpoTerm.href}>
              <FieldValueString value={hpoTerm.id} />
            </Anchor>
          </>
        )}
      </For>
      <Show when={gadoClass !== null && gadoClass === "LC"} keyed>
        <abbr
          title="Gene phenotype relation predicted by GADO with low confidence; Z-Score greater than 3 but below 5."
          class="ml-1 is-clickable"
        >
          <i class="fas fa-circle-exclamation has-text-warning" />
        </abbr>
      </Show>
      <Show when={gadoClass !== null && gadoClass === "HC"} keyed>
        <abbr
          title="Gene phenotype relation predicted by GADO with high confidence; Z-Score greater than 5."
          class="ml-1 is-clickable"
        >
          <i class="fas fa-circle-exclamation has-text-success" />
        </abbr>
      </Show>
    </>
  );
};
