import { Component } from "solid-js";
import { Anchor } from "../../Anchor";
import { OntologyClass } from "@molgenis/vip-report-api/src/Api";

export const HpoTerm: Component<{
  ontologyClass: OntologyClass;
}> = (props) => {
  const hpoTerm = props.ontologyClass.id;
  const label = props.ontologyClass.label;

  return <>{<Anchor href={`https://hpo.jax.org/app/browse/term/${hpoTerm}`} value={label} />}</>;
};
