import { Component } from "solid-js";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Allele } from "../../Allele";
import { ConfigFieldCustomGenotype } from "../../../../types/configFieldCustom";
import { getRecordSample } from "../../../../utils/recordUtils";
import { ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";

export const FieldCustomGenotypeStr: Component<{
  fieldConfig: ConfigFieldCustomGenotype;
  record: Item<Record>;
}> = (props) => {
  const repeatCount = (): ValueString =>
    getRecordSample(props.record, props.fieldConfig.sample)["REPCN"] as ValueString;
  const repeatUnitValue = (): ValueString => props.record.data.n["RU"] as ValueString;

  return (
    <>
      <Allele value={repeatUnitValue()} isAbbreviate={false} />
      <span class="ml-1">{`(${repeatCount()})`}</span>
    </>
  );
};
