import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";

import { getInfoNestedField, getInfoValue, getSampleField, getSampleValue } from "./vcf.ts";
import { SampleContainer, VcfMetadataContainer } from "./api.ts";
import { RuntimeError } from "./error.ts";

export function getDecisionTreePath(
  metadata: VcfMetadataContainer,
  variant: Item<VcfRecord>,
  csqId: number,
): DecisionTreePath {
  let decisionTreePath: DecisionTreePath;
  const fieldMetadata = getInfoNestedField(metadata, "CSQ", "VIPP");
  if (fieldMetadata) {
    const value = getInfoValue(variant, csqId, fieldMetadata);
    if (value === undefined) throw new RuntimeError("required value must not be undefined");
    decisionTreePath = value as DecisionTreePath;
  } else {
    decisionTreePath = [];
  }
  return decisionTreePath;
}

export function getSampleTreePath(
  metadata: VcfMetadataContainer,
  sample: SampleContainer,
  variant: Item<VcfRecord>,
  csqId: number,
): DecisionTreePath {
  let decisionTreePath: DecisionTreePath;
  const fieldMetadata = getSampleField(metadata, "VIPP_S");
  if (fieldMetadata) {
    const value = getSampleValue(sample, variant, -1, fieldMetadata); // TODO replace with getSampleNestedValue once VIPP_S metadata is nested
    if (value === undefined) throw new RuntimeError("required value must not be undefined");
    if (!Array.isArray(value)) throw new RuntimeError();
    const valueArray = value as string[];
    if (valueArray.length <= csqId) throw new RuntimeError();
    decisionTreePath = valueArray[csqId]!.split("&") as DecisionTreePath;
  } else {
    decisionTreePath = [];
  }
  return decisionTreePath;
}
