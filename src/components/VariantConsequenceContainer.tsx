import { Component } from "solid-js";
import { SampleContainer, VcfMetadataContainer } from "../utils/api.ts";
import { Value, VcfRecord } from "@molgenis/vip-report-vcf";
import { DecisionTree, Item, Sample } from "@molgenis/vip-report-api";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { VariantConsequenceTable } from "./VariantConsequenceTable.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { DecisionTreePath } from "./tree/DecisionTreePath.tsx";
import { getDecisionTreePath, getSampleTreePath } from "../utils/decisionTree.ts";
import { VariantType } from "../utils/variantType.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { getInfoField, getInfoValue } from "../utils/vcf.ts";
import { RuntimeError } from "../utils/error.ts";

export const VariantConsequenceContainer: Component<{
  metadata: VcfMetadataContainer;
  variantType: VariantType;
  consequenceId: number;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
  decisionTree: DecisionTree | null;
  sampleTree: DecisionTree | null;
}> = (props) => {
  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);
  const csqField = () => {
    const csqField = getInfoField(props.metadata, "CSQ");
    if (csqField === undefined) throw new RuntimeError();
    return csqField;
  };
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
              csqMetadata={csqField().nested?.items || []}
              csqValues={(getInfoValue(props.record, 0, csqField()) as Value[])[props.consequenceId] as Value[]}
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
                  path={getSampleTreePath(props.metadata, props.sample, props.record, props.consequenceId)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
