import { Component } from "solid-js";

export const ClinVar: Component<{
  value: string;
}> = (props) => {
  function getClass(value: string): string {
    const vClasses = [];
    for (const token of value) {
      let vClass;
      switch (token) {
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
        default:
          vClass = value;
      }
      vClasses.push(vClass);
    }
    return vClasses.join("/");
  }

  return <span>{getClass(props.value)}</span>;
};
