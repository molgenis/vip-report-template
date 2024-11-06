import { ValueArray, VcfMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getSpecificConsequence } from "./viewUtils";

export function getDecisionTreePath(
  recordsMetadata: VcfMetadata,
  variant: Item<VcfRecord>,
  csqId: number,
): DecisionTreePath {
  if (recordsMetadata.info.CSQ.nested === undefined) {
    throw new Error("Required nested VEP metadata is undefined.");
  }
  return getSpecificConsequence(variant.data.n.CSQ as ValueArray, csqId)[
    recordsMetadata.info.CSQ.nested.items.findIndex((csq) => csq.id === "VIPP")
  ] as DecisionTreePath;
}

export function getSampleTreePath(
  recordsMetadata: VcfMetadata,
  sampleIndex: number,
  variant: Item<VcfRecord>,
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
