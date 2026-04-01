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
import { CollapsiblePane } from "../components/CollapsablePane.tsx";
import { initConfig } from "../utils/config/config.ts";
import { Classification } from "./poc/Classification.tsx";
import { CellValueRD3 } from "../types/configCellComposed";
import { CommentEditor } from "./poc/CommentEditor.tsx";
import { ClassificationViewer } from "./poc/ClassificationViewer.tsx";
import { CommentViewer } from "./poc/CommentViewer.tsx";

export const VariantContainer: Component<{
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  record: Item<VcfRecord>;
  sample: SampleContainer | null;
  reportId: string;
}> = (props) => {
  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample, props.reportId);
  const samples = (): Item<Sample>[] => (props.sample ? getPedigreeSamples(props.sample) : []);

  function createConfigFieldCustomRD3(
  ): CellValueRD3 {
    return {
      c: props.record.data.c,
      p: props.record.data.p,
      a: props.record.data.a.toString(),
      id: props.record.id,
      report: props.reportId,
      s: props.sample?.item.data.person.individualId
    };
  }

  return (
    <>
      <div class="columns">
        <div class="column">
          <CollapsiblePane title="Genome Browser" defaultOpen={false}>
            <GenomeBrowser metadata={props.metadata} samples={samples()} record={props.record} />
          </CollapsiblePane>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <CollapsiblePane title="MOLGENIS RD3" defaultOpen={false}>
            <div class="columns">
              <div class="column">
                <span>
                  <b>Classification: </b>
                </span>
                <br />
                <Classification rd3={createConfigFieldCustomRD3()} />
                <br />
                <span>
                  <b>Other runs: </b>
                </span>
                <br />
                <ClassificationViewer rd3={createConfigFieldCustomRD3()} />
                <br />
              </div>
              <div class="column">
                <span>
                  <b>Add comments: </b>
                </span>
                <CommentEditor rd3={createConfigFieldCustomRD3()} />
              </div>
              <div class="column">
                <span>
                  <b>Comments from other runs: </b>
                </span>
                <CommentViewer rd3={createConfigFieldCustomRD3()} />
              </div>
              <div class="column" />
            </div>
          </CollapsiblePane>
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
