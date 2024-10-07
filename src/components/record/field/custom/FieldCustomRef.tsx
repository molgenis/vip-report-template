import { Component } from "solid-js";
import { Allele } from "../../Allele";
import { ConfigFieldCustomRef } from "../../../../types/configField";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";

export const FieldCustomRef: Component<{ fieldConfig: ConfigFieldCustomRef; record: Item<Record> }> = (props) => {
  return <Allele value={props.record.data.r} isAbbreviate={true} />;
};
