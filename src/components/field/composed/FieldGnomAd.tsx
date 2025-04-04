import { Component, Show } from "solid-js";
import { FieldFloat } from "../typed/FieldFloat";
import { Anchor } from "../../Anchor";
import { CellValueGnomAd } from "../../../types/configCellComposed";

export const FieldGnomAd: Component<{
  value: CellValueGnomAd;
}> = (props) => {
  const alleleNum = () => props.value.alleleNum;
  const gnomAdAf = () => props.value.gnomAdAf;
  const gnomAdCov = () => props.value.gnomAdCov;
  const gnomAdQc = () => props.value.gnomAdQcs || [];

  const href = (): string | undefined => {
    let href;
    if (gnomAdAf() !== null && alleleNum() !== undefined) {
      const alt = props.value.a[alleleNum()! - 1];
      if (alt) {
        const variantId = [props.value.c, props.value.p, props.value.r, alt].join("-");
        const dataset = "gnomad_r4";
        href = `https://gnomad.broadinstitute.org/variant/${encodeURIComponent(variantId)}?dataset=${dataset}`;
      }
    }
    return href;
  };

  const lowCoverage = () => {
    const cov = gnomAdCov();
    return cov != null && cov < 0.5;
  };

  return (
    <Show when={gnomAdAf() !== null}>
      <Show when={href()} fallback={<FieldFloat value={gnomAdAf()} />} keyed>
        {(href) => (
          <>
            <Anchor href={href}>
              <FieldFloat value={gnomAdAf()} />
            </Anchor>
            <Show when={gnomAdQc().length > 0}>
              <abbr title={"Failed quality control filters: " + gnomAdQc().join(", ")} class="ml-1 is-clickable">
                <i class="fas fa-circle-exclamation has-text-warning" />
              </abbr>
            </Show>
            <Show when={lowCoverage()}>
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
