import { Component } from "solid-js";
import { A } from "@solidjs/router";
import { Chrom } from "../../Chrom";
import { Pos } from "../../Pos";
import { ConfigFieldCustomLocus } from "../../../../types/configField";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";

export const FieldCustomLocus: Component<{ fieldConfig: ConfigFieldCustomLocus; record: Item<Record> }> = (props) => {
  return (
    <A href={props.fieldConfig.href(props.record)}>
      <Chrom value={props.record.data.c} />
      <span>:</span>
      <Pos value={props.record.data.p} />
    </A>
  );
};
