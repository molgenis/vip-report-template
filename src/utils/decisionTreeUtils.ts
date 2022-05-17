import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getSpecificConsequence } from "./viewUtils";

export function getDecisionTreePath(recordsMetadata: Metadata, variant: Item<Record>, csqId: number): DecisionTreePath {
  return getSpecificConsequence(variant.data.n.CSQ, csqId)[
    recordsMetadata.info.CSQ.nested.items.findIndex((csq) => csq.id === "VIPP")
  ] as DecisionTreePath;
}
