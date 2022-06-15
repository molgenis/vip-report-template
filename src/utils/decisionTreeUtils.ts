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
