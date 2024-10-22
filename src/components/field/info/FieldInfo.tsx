import { Component, Match, Switch } from "solid-js";
import { FieldConsequence } from "./FieldConsequence";
import { FieldTyped } from "../typed/FieldTyped";
import { FieldPubMed } from "./FieldPubMed";
import { FieldHgvs } from "./FieldHgvs";
import { isAnyCsqInfo, isCsqInfo } from "../../../utils/csqUtils";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueInfo } from "../../../types/configCell";
import { InfoMetadata } from "../../../../../vip-report-vcf/src/types/Metadata";

export const FieldInfo: Component<{
  metadata: InfoMetadata;
  value: CellValueInfo;
}> = (props) => {
  return (
    <Switch fallback={<FieldTyped metadata={props.metadata} value={props.value} />}>
      <Match when={isCsqInfo(props.metadata, "Consequence")}>
        <FieldConsequence value={props.value as string[]} />
      </Match>
      <Match when={isCsqInfo(props.metadata, "PUBMED")}>
        <FieldPubMed value={props.value as number[]} />
      </Match>
      <Match when={isAnyCsqInfo(props.metadata, ["HGVSc", "HGVSp"])}>
        <FieldHgvs value={props.value as ValueString} />
      </Match>
    </Switch>
  );
};