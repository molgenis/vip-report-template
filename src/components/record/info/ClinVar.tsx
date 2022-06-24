import { Component } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";

export const ClinVar: Component<{
  value: string[];
  infoMetadata: FieldMetadata;
}> = (props) => {
  const label = () => {
    return props.value
      .map((token) => {
        let vClass;
        switch (token.toLowerCase()) {
          case "benign":
            vClass = "B";
            break;
          case "likely_benign":
            vClass = "LB";
            break;
          case "uncertain_significance":
            vClass = "VUS";
            break;
          case "likely_pathogenic":
            vClass = "LP";
            break;
          case "pathogenic":
            vClass = "P";
            break;
          case "conflicting_interpretations_of_pathogenicity":
            vClass = "Conflict";
            break;
          default:
            vClass = token;
        }
        return vClass;
      })
      .join(", ");
  };
  return <span>{label()}</span>;
};
