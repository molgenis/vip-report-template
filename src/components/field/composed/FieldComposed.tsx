import { Component, Match, Switch } from "solid-js";
import { FieldLocus } from "./FieldLocus";
import { FieldRef } from "./FieldRef";
import { FieldVipC } from "./FieldVipC";
import { FieldGenotype } from "./FieldGenotype";
import { FieldGene } from "./FieldGene";
import { ErrorNotification } from "../../ErrorNotification";
import { FieldClinVar } from "./FieldClinVar";
import { FieldGnomAd } from "./FieldGnomAd";
import { FieldHpo } from "./FieldHpo";
import { ConfigCellCustom } from "../../../types/configCells";
import {
  CellValueClinVar,
  CellValueCustom,
  CellValueGene,
  CellValueGenotype,
  CellValueGnomAd,
  CellValueHpo,
  CellValueInheritanceModes,
  CellValueLocus,
  CellValueRef,
  CellValueVipC,
  CellValueVipCS,
  CellValueVkgl,
} from "../../../types/configCellComposed";
import { FieldVkgl } from "./FieldVkgl";
import { FieldInheritanceModes } from "./FieldInheritanceModes";
import { FieldVipCS } from "./FieldVipCS.tsx";

export const FieldComposed: Component<{
  config: ConfigCellCustom<CellValueCustom>;
  value: CellValueCustom;
}> = (props) => {
  const id = () => props.config.id;

  return (
    <Switch fallback={<ErrorNotification error={`unknown composed cell identifier ${id()}`} />}>
      <Match when={id() === "clinVar"}>
        <FieldClinVar value={props.value as CellValueClinVar} />
      </Match>
      <Match when={id() === "gene"}>
        <FieldGene value={props.value as CellValueGene} />
      </Match>
      <Match when={id() === "genotype" || id() === "genotype_maternal" || id() === "genotype_paternal"}>
        <FieldGenotype value={props.value as CellValueGenotype} />
      </Match>
      <Match when={id() === "gnomAdAf"}>
        <FieldGnomAd value={props.value as CellValueGnomAd} />
      </Match>
      <Match when={id() === "hpo"}>
        <FieldHpo value={props.value as CellValueHpo} />
      </Match>
      <Match when={id() === "inheritancePattern"}>
        <FieldInheritanceModes value={props.value as CellValueInheritanceModes} />
      </Match>
      <Match when={id() === "locus"}>
        <FieldLocus value={props.value as CellValueLocus} />
      </Match>
      <Match when={id() === "ref"}>
        <FieldRef value={props.value as CellValueRef} />
      </Match>
      <Match when={id() === "vipC"}>
        <FieldVipC value={props.value as CellValueVipC} />
      </Match>
      <Match when={id() === "vipCS"}>
        <FieldVipCS value={props.value as CellValueVipCS} />
      </Match>
      <Match when={id() === "vkgl"}>
        <FieldVkgl value={props.value as CellValueVkgl} />
      </Match>
    </Switch>
  );
};
