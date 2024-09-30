import { Component, Match, Switch } from "solid-js";
import { FieldConsequence } from "./FieldConsequence";
import { FieldTyped } from "../typed/FieldTyped";
import { FieldPubMed } from "./FieldPubMed";
import { FieldHgvs } from "./FieldHgvs";
import { isAnyCsqInfo, isCsqInfo } from "../../../utils/csqUtils";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueInfo, ConfigCellInfo } from "../../../types/configCell";

export const FieldInfo: Component<{
  config: ConfigCellInfo;
  value: CellValueInfo;
}> = (props) => {
  return (
    <Switch fallback={<FieldTyped metadata={props.config.field} value={props.value} />}>
      <Match when={isCsqInfo(props.config.field, "Consequence")}>
        <FieldConsequence value={props.value as string[]} />
      </Match>
      <Match when={isCsqInfo(props.config.field, "PUBMED")}>
        <FieldPubMed value={props.value as number[]} />
      </Match>
      <Match when={isAnyCsqInfo(props.config.field, ["HGVSc", "HGVSp"])}>
        <FieldHgvs value={props.value as ValueString} />
      </Match>
    </Switch>
  );
};
