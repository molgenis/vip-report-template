import { Component, Match, Switch } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Consequence } from "./info/Consequence";
import { Field, FieldContext, FieldValue } from "./field/Field";
import { Gene } from "./info/Gene";
import { PubMed } from "./info/PubMed";
import { Hgvs } from "./info/Hgvs";
import { ClinVar } from "./info/ClinVar";
import { GnomAD } from "./info/GnomAD";
import { isAnyCsqInfo, isCsqInfo } from "../../utils/csqUtils";
import { Vkgl } from "./info/Vkgl";
import { InheritanceModes } from "./info/InheritanceModes";
import { Hpo } from "./info/Hpo";

export const Info: Component<{
  info: FieldValue;
  infoMeta: FieldMetadata;
  context: FieldContext;
}> = (props) => {
  return (
    <Switch fallback={<Field {...props} />}>
      <Match when={isCsqInfo(props.infoMeta, "Consequence")}>
        <Consequence {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "PUBMED")}>
        <PubMed {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "SYMBOL")}>
        <Gene {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "InheritanceModesGene")}>
        <InheritanceModes {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "gnomAD_AF")}>
        <GnomAD {...props} />
      </Match>
      <Match when={isAnyCsqInfo(props.infoMeta, ["HGVSc", "HGVSp"])}>
        <Hgvs {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "clinVar_CLNSIG")}>
        <ClinVar {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "VKGL_CL")}>
        <Vkgl {...props} />
      </Match>
      <Match when={isCsqInfo(props.infoMeta, "HPO")}>
        <Hpo {...props} />
      </Match>
    </Switch>
  );
};
