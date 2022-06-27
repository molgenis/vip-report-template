import { Component, Show } from "solid-js";
import { FieldProps } from "../field/Field";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Anchor } from "../../Anchor";

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

  return (
    <Show when={label()}>
      {(label) => (
        <Anchor href={href()}>
          <span>{label}</span>
        </Anchor>
      )}
    </Show>
  );
};
