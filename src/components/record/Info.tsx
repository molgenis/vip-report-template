import { Component, Match, Switch } from "solid-js";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Consequence } from "./info/Consequence";
import { Field } from "./field/Field";
import { Gene } from "./info/Gene";
import { PubMed } from "./info/PubMed";
import { Hgvs } from "./info/Hgvs";
import { ClinVar } from "./info/ClinVar";

export const Info: Component<{
  info: Value | Value[];
  infoMetadata: FieldMetadata;
  href?: string;
}> = (props) => {
  return (
    <Switch fallback={<Field info={props.info} infoMetadata={props.infoMetadata} />}>
      <Match when={props.infoMetadata.id === "Consequence" && props.infoMetadata.parent?.id === "CSQ"}>
        <Consequence terms={props.info as string[]} href={props.href} />
      </Match>
      <Match when={props.infoMetadata.id === "PUBMED" && props.infoMetadata.parent?.id === "CSQ"}>
        <PubMed ids={props.info as number[]} />
      </Match>
      <Match when={props.infoMetadata.id === "SYMBOL" && props.infoMetadata.parent?.id === "CSQ"}>
        {props.info !== null && <Gene symbol={props.info as string} />}
      </Match>

      <Match
        when={
          (props.infoMetadata.id === "HGVSc" || props.infoMetadata.id === "HGVSp") &&
          props.infoMetadata.parent?.id === "CSQ"
        }
      >
        {props.info !== null && <Hgvs notation={props.info as string} />}
      </Match>
      <Match when={props.infoMetadata.id === "CLIN_SIG" && props.infoMetadata.parent?.id === "CSQ"}>
        {props.info !== null && <ClinVar value={props.info as string} />}
      </Match>
    </Switch>
  );
};
