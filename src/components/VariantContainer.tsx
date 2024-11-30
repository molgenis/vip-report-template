import { Component, Show } from "solid-js";
import { MetadataContainer, SampleContainer } from "../utils/api.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { GenomeBrowser } from "./GenomeBrowser.tsx";
import { VariantTable } from "./VariantTable.tsx";
import { VariantInfoTable } from "./VariantInfoTable.tsx";
import { RecordsTable } from "./RecordsTable.tsx";
import { ConfigJson } from "../types/config";
import { VariantType } from "../utils/variantType.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { VariantGenotypeTable } from "./VariantGenotypeTable.tsx";
import { initConfig } from "../utils/config/config.ts";

export const VariantContainer: Component<{
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
}> = (props) => {
  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample);
  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);

  return (
    <>
      <div class="columns">
        <div class="column">
          <GenomeBrowser metadata={props.metadata} samples={samples()} record={props.record} />
        </div>
      </div>
      <div class="columns">
        <div class="column is-3">
          <h1 class="title is-5">Record</h1>
          <VariantTable variant={props.record.data} />
        </div>
        <div class="column is-3">
          <h1 class="title is-5">Info</h1>
          <VariantInfoTable variantType={props.variantType} metadata={props.metadata} record={props.record} />
        </div>
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
      </div>
      <div class="columns">
        <div class="column is-full">
          <RecordsTable fieldConfigs={config().variant.cells} records={[props.record]} verticalHeaders={true} />
        </div>
      </div>
    </>
  );
};
