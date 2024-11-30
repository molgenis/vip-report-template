import { Component, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../utils/api.ts";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { DecisionTree, Item, Sample } from "@molgenis/vip-report-api";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { VariantConsequenceTable } from "./VariantConsequenceTable.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { DecisionTreePath } from "./tree/DecisionTreePath.tsx";
import { getDecisionTreePath, getSampleTreePath } from "../utils/decisionTree.ts";
import { VariantType } from "../utils/variantType.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { ConfigJson } from "../types/config";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { initConfig } from "../utils/config/config.ts";

export const VariantConsequenceContainer: Component<{
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  consequenceId: number;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
  decisionTree: DecisionTree | null;
  sampleTree: DecisionTree | null;
}> = (props) => {
  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample);

  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);
  const hasDecisionTreePathMeta = () =>
    (props.metadata.records.info.CSQ?.nested?.items || []).findIndex((csq) => csq.id === "VIPP") !== -1;
  const hasSampleTreePathMeta = () => props.metadata.records.format.VIPP_S != null;

  return (
    <>
      <div class="columns">
        <div class="column is-4">
          <div>
            <h1 class="title is-5">Info</h1>
            <VariantInfoTable variantType={props.variantType} metadata={props.metadata} record={props.record} />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Consequence</h1>
            <VariantConsequenceTable
              variantType={props.variantType}
              metadata={props.metadata}
              record={props.record}
              consequenceId={props.consequenceId}
            />
          </div>
          <div class="mt-3">
            <h1 class="title is-5">Record</h1>
            <VariantTable variant={props.record.data} />
          </div>
        </div>
        <div class="column is-8">
          <Show when={config().variant.samplesCells}>
            {(samplesCells) => (
              <div class="column">
                <h1 class="title is-5">Samples</h1>
                <VariantGenotypeTable
                  config={samplesCells()}
                  samples={samples()}
                  metadata={props.metadata}
                  variantType={props.variantType}
                  record={props.record}
                />
              </div>
            )}
          </Show>
          <div class="columns mt-3">
            {props.decisionTree !== null && hasDecisionTreePathMeta() && (
              <div class="column is-6">
                <h1 class="title is-5">Variant classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.decisionTree}
                  path={getDecisionTreePath(props.metadata.records, props.record, props.consequenceId)}
                />
              </div>
            )}
            {props.sampleTree !== null && hasSampleTreePathMeta() && props.sample && (
              <div class="column is-6">
                <h1 class="title is-5">Sample classification tree path</h1>
                <DecisionTreePath
                  decisionTree={props.sampleTree}
                  path={getSampleTreePath(props.metadata.records, props.sample, props.record, props.consequenceId)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
