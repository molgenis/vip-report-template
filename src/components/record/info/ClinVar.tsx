import { Component, Show } from "solid-js";
import { FieldProps } from "../field/Field";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Anchor } from "../../Anchor";
import { Abbr } from "../../Abbr";

export const ClinVar: Component<FieldProps> = (props) => {
  const label = () => {
    const classes = props.info.value as string[] | null;
    return classes
      ? classes
          .map((token) => {
            switch (token.toLowerCase()) {
              case "benign":
                return "B";
              case "likely_benign":
                return "LB";
              case "uncertain_significance":
                return "VUS";
              case "likely_pathogenic":
                return "LP";
              case "pathogenic":
                return "P";
              case "conflicting_interpretations_of_pathogenicity":
                return "Conflict";
              default:
                return token;
            }
          })
          .join(", ")
      : null;
  };

  const href = () => {
    const clinVarIdsField = props.infoMeta.parent?.nested?.items.findIndex((item) => item.id === "clinVar");
    const clinVarIds = clinVarIdsField ? ((props.info.valueParent as Value[])[clinVarIdsField] as number[]) : [];
    return clinVarIds.length === 1 ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVarIds[0]}/` : undefined;
  };

  const description = () => {
    const statusField = props.infoMeta.parent?.nested?.items.findIndex((item) => item.id === "clinVar_CLNREVSTAT");
    const status = statusField ? ((props.info.valueParent as Value[])[statusField] as string[]) : [];
    if (status.length === 0) return;

    let description;
    if (status.length === 1 && status.includes("practice_guideline")) {
      description = "\u2605\u2605\u2605\u2605";
    } else if (status.length === 1 && status.includes("reviewed_by_expert_panel")) {
      description = "\u2605\u2605\u2605\u2606";
    } else if (
      status.length === 3 &&
      status.includes("criteria_provided") &&
      status.includes("_multiple_submitters") &&
      status.includes("_no_conflicts")
    ) {
      description = "\u2605\u2605\u2606\u2606";
    } else if (
      status.length === 2 &&
      status.includes("criteria_provided") &&
      status.includes("_conflicting_interpretations")
    ) {
      description = "\u2605\u2606\u2606\u2606";
    } else if (status.length === 2 && status.includes("criteria_provided") && status.includes("_single_submitter")) {
      description = "\u2605\u2606\u2606\u2606";
    } else {
      description = "\u2606\u2606\u2606\u2606";
    }
    description += " (" + status.map((status) => status.replaceAll("_", " ").trim()).join(", ") + ")";
    return description;
  };

  return (
    <Show when={label()}>
      {(label) => (
        <Anchor href={href()}>
          {description() ? <Abbr title={description()!} value={label} /> : <span>{label}</span>}
        </Anchor>
      )}
    </Show>
  );
};
