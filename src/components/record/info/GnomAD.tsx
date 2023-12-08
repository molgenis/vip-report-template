import { Component, Show } from "solid-js";
import { FieldValueFloat } from "../field/FieldValueFloat";
import { FieldProps } from "../field/Field";
import { ValueFloat } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Anchor } from "../../Anchor";

export const GnomAD: Component<FieldProps> = (props) => {
  const af = (): number | null => props.info.value as ValueFloat;

  const href = (): string | undefined => {
    let href;
    if (af()) {
      let dataset;
      switch (props.context.genomeAssembly) {
        case "GRCh37":
          dataset = "gnomad_r2_1";
          break;
        case "GRCh38":
          dataset = "gnomad_r3";
          break;
        default:
          dataset = null;
          break;
      }

      if (dataset) {
        const record = props.info.record.data;
        // FIXME record.a incorrect: select record.a through CSQ:ALLELE_NUM
        const variantId = [record.c, record.p, record.r, record.a].join("-");
        href = `https://gnomad.broadinstitute.org/variant/${encodeURIComponent(variantId)}?dataset=${dataset}`;
      }
    }
    return href;
  };

  return (
    <Show when={af() !== null}>
      <Show when={href()} fallback={<FieldValueFloat value={af()} />} keyed>
        {(href) => (
          <Anchor href={href}>
            <FieldValueFloat value={af()} />
          </Anchor>
        )}
      </Show>
    </Show>
  );
};
