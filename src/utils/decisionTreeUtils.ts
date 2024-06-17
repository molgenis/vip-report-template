import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getSpecificConsequence } from "./viewUtils";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";

export function getDecisionTreePath(recordsMetadata: Metadata, variant: Item<Record>, csqId: number): DecisionTreePath {
  if (recordsMetadata.info.CSQ.nested === undefined) {
    throw new Error("Required nested VEP metadata is undefined.");
  }
  return getSpecificConsequence(variant.data.n.CSQ as ValueArray, csqId)[
    recordsMetadata.info.CSQ.nested.items.findIndex((csq) => csq.id === "VIPP")
  ] as DecisionTreePath;
}

export function getSampleTreePath(
  recordsMetadata: Metadata,
  sampleIndex: number,
  variant: Item<Record>,
  csqId: number,
): DecisionTreePath {
  const vipp_s = variant.data.s[sampleIndex].VIPP_S as ValueArray;
  let sampleTreePath: DecisionTreePath = [];
  if (vipp_s !== undefined) {
    const sampleTreePathString = vipp_s[csqId] as string | null;
    if (sampleTreePathString !== null) {
      sampleTreePath = sampleTreePathString.split("&") as DecisionTreePath;
    }
  }
  return sampleTreePath;
}
