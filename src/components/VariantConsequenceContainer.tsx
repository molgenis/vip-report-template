import { Component } from "solid-js";
import { SampleContainer } from "../Api.ts";
import { Metadata, Record } from "../../../vip-report-vcf/src/Vcf.ts";
import { DecisionTree, Item, Sample } from "../../../vip-report-api/src/Api";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { VariantConsequenceTable } from "./VariantConsequenceTable.tsx";
import { getSpecificConsequence } from "../utils/viewUtils.ts";
import { ValueArray } from "../../../vip-report-vcf/src/ValueParser.ts";
import { VariantTable } from "./VariantTable.tsx";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { DecisionTreePath } from "./tree/DecisionTreePath.tsx";
import { getDecisionTreePath, getSampleTreePath } from "../utils/decisionTreeUtils.ts";
import { VariantType } from "../utils/variantTypeUtils.ts";

export const VariantConsequenceContainer: Component<{
  metadata: Metadata;
  variantType: VariantType;
  consequenceId: number;
  record: Item<Record>;
  sample: SampleContainer | null;
  decisionTree: DecisionTree | null;
  sampleTree: DecisionTree | null;
}> = (props) => {
  const samples = (): Item<Sample>[] =>
    props.sample
      ? [
          props.sample.item,
          props.sample.maternalSample,
          props.sample.paternalSample,
          ...props.sample.otherPedigreeSamples,
        ].filter((id) => id !== null)
      : [];

  const hasDecisionTreePathMeta = () =>
    (props.metadata.info.CSQ?.nested?.items || []).findIndex((csq) => csq.id === "VIPP") !== -1;
  const hasSampleTreePathMeta = () => props.metadata.format.VIPP_S != null;

  return (
    <>
      <div class="columns">
        <div class="column is-4">
          <div>
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable infoMetadataContainer={props.metadata.info} infoContainer={props.record.data.n} />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Consequence</h1>
            <VariantConsequenceTable
              csqMetadata={props.metadata.info.CSQ?.nested !== undefined ? props.metadata.info.CSQ.nested.items : []}
              csqValues={getSpecificConsequence(props.record.data.n.CSQ as ValueArray, props.consequenceId)}
              record={props.record}
            />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={props.record.data} />
          </div>
        </div>
        <div class="column is-8">
          <div>
            <h1 class="title is-5">Samples</h1>
            <VariantGenotypeTable
              samples={samples()}
              formatMetadataContainer={props.metadata.format}
              recordSamples={props.record.data.s}
            />
          </div>
          <div class="columns mt-3">
            {props.decisionTree !== null && hasDecisionTreePathMeta() && (
              <div class="column is-6">
                <h1 class="title is-5">Variant classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.decisionTree}
                  path={getDecisionTreePath(props.metadata, props.record, props.consequenceId)}
                />
              </div>
            )}
            {props.sampleTree !== null && hasSampleTreePathMeta() && props.sample && (
              <div class="column is-6">
                <h1 class="title is-5">Sample classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.sampleTree}
                  path={getSampleTreePath(
                    props.metadata,
                    props.sample.item.data.index,
                    props.record,
                    props.consequenceId,
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
