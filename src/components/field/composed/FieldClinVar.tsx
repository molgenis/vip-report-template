import { Component, Show } from "solid-js";
import { Anchor } from "../../Anchor";
import { Abbr } from "../../Abbr";
import { CellValueClinVar } from "../../../types/configCellComposed";

export const FieldClinVar: Component<{
  value: CellValueClinVar;
}> = (props) => {
  const label = () =>
    props.value.clnSigs
      .filter((category) => category !== null)
      .map((category) => category.label)
      .join(", ");

  const href = () => {
    const ids = props.value.clnIds;
    return ids && ids.length === 1 ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${ids[0]}/` : undefined;
  };

  const description = () => {
    const status = props.value.clnRevStats || [];
    if (status.length === 0) return;

    const statusValues = status.filter((category) => category !== null).map((category) => category.value);
    const descriptionText = status
      .filter((category) => category !== null)
      .map((category) => category.label)
      .join(", ");

    let description;
    if (status.length === 1 && statusValues.includes("practice_guideline")) {
      description = "\u2605\u2605\u2605\u2605";
    } else if (status.length === 1 && statusValues.includes("reviewed_by_expert_panel")) {
      description = "\u2605\u2605\u2605\u2606";
    } else if (
      status.length === 3 &&
      statusValues.includes("criteria_provided") &&
      statusValues.includes("_multiple_submitters") &&
      statusValues.includes("_no_conflicts")
    ) {
      description = "\u2605\u2605\u2606\u2606";
    } else if (
      status.length === 2 &&
      statusValues.includes("criteria_provided") &&
      statusValues.includes("_conflicting_interpretations")
    ) {
      description = "\u2605\u2606\u2606\u2606";
    } else if (
      status.length === 2 &&
      statusValues.includes("criteria_provided") &&
      statusValues.includes("_single_submitter")
    ) {
      description = "\u2605\u2606\u2606\u2606";
    } else {
      description = "\u2606\u2606\u2606\u2606";
    }
    description += " (" + descriptionText + ")";
    return description;
  };

  return (
    <Show when={label()}>
      {(label) => (
        <Anchor href={href()}>
          <Show when={description()} fallback={<span>{label()}</span>}>
            {(description) => <Abbr title={description()} value={label()} />}
          </Show>
        </Anchor>
      )}
    </Show>
  );
};
