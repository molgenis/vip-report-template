import { Component } from "solid-js";
import { Anchor } from "./Anchor";
import { OntologyClass } from "@molgenis/vip-report-api/src/Api";

export const HpoTerm: Component<{
  ontologyClass: OntologyClass;
}> = (props) => {
  return (
    <Anchor href={`https://hpo.jax.org/app/browse/term/${props.ontologyClass.id}`}>
      <span>{props.ontologyClass.label}</span>
    </Anchor>
  );
};
