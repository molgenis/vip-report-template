import { Component, createMemo, For, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { FieldProps } from "../field/Field";
import { ValueFlag, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";
import { Abbr } from "../../Abbr";
import { FieldSingleValue } from "../field/FieldSingleValue";
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
    </>
  );
};
