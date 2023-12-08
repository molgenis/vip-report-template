import { Component, Show } from "solid-js";
import { FieldValueFloat } from "../field/FieldValueFloat";
import { FieldProps } from "../field/Field";
import { ValueFloat } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Anchor } from "../../Anchor";
import { getCsqInfo, getCsqInfoIndex } from "../../../utils/csqUtils";

export const GnomAD: Component<FieldProps> = (props) => {
  const af = (): number | null => props.info.value as ValueFloat;

  const qcIndex = (): number => getCsqInfoIndex(props.infoMeta, "gnomAD_QC");
  const qc = (): string[] => (qcIndex() !== -1 ? (getCsqInfo(props.info, qcIndex()) as string[]) : []);
  const covIndex = (): number => getCsqInfoIndex(props.infoMeta, "gnomAD_COV");
  const cov = (): number | null => (covIndex() !== -1 ? (getCsqInfo(props.info, covIndex()) as number) : null);

  const href = (): string | undefined => {
    let href;
    if (af() !== null) {
      const record = props.info.record.data;
      // FIXME record.a incorrect: select record.a through CSQ:ALLELE_NUM
      const variantId = [record.c, record.p, record.r, record.a].join("-");
      const dataset = "gnomad_r4";
      href = `https://gnomad.broadinstitute.org/variant/${encodeURIComponent(variantId)}?dataset=${dataset}`;
    }
    return href;
  };

  return (
    <Show when={af() !== null}>
      <Show when={href()} fallback={<FieldValueFloat value={af()} />} keyed>
        {(href) => (
          <>
            <Anchor href={href}>
              <FieldValueFloat value={af()} />
            </Anchor>
            <Show when={qc().length > 0}>
              <abbr title={"Failed quality control filters: " + qc().join(", ")} class="ml-1 is-clickable">
                <i class="fas fa-circle-exclamation has-text-warning" />
              </abbr>
            </Show>
            <Show when={cov() != null && cov() < 0.5}>
              <abbr
                title="This variant is covered in fewer than 50% of individuals in gnomAD. This may indicate a low-quality site."
                class="ml-1 is-clickable"
              >
                <i class="fas fa-circle-exclamation has-text-warning" />
              </abbr>
            </Show>
          </>
        )}
      </Show>
    </Show>
  );
};
