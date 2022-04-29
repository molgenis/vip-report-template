import { Component, Match, Switch } from "solid-js";
import { Value } from "../../../api/vcf/ValueParser";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";

export const FieldSingleValue: Component<{
  info: Value;
  infoMetadata: FieldMetadata;
}> = (props) => {
  // TODO add match for CATEGORICAL
  // TODO add match for INTEGER
  // TODO add match for FLAG
  // TODO add match for STRING
  // TODO improve match for FLOAT (show full number on hover)
  return (
    <Switch fallback={<span>{props.info as string}</span>}>
      <Match when={props.infoMetadata.type === "FLOAT"}>
        {props.info !== null && props.info !== undefined && (
          <abbr title={props.info as string}>{(props.info as number).toFixed(4)}</abbr>
        )}
      </Match>
    </Switch>
  );
};
