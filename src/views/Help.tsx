import { Component, createResource, createSignal, For, Show } from "solid-js";
import { Anchor } from "../components/Anchor";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { VcfHeaderRow } from "../components/VcfHeaderRow";
import { getHeaderValue } from "../utils/viewUtils";
import { Item, Phenotype, PhenotypicFeature } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "../components/HpoTerm";
import { createAsync } from "@solidjs/router";
import { getMetadata } from "./data/data";
import { fetchPhenotypes, fetchRecords, fetchSamples } from "../Api.ts";
import { EMPTY_PARAMS, EMPTY_PHENOTYPES, EMPTY_RECORDS_PAGE, EMPTY_SAMPLES_PAGE } from "../utils/utils.ts";

export const Help: Component = () => {
  const [params] = createSignal(EMPTY_PARAMS);
  const [samples] = createResource(params, fetchSamples, { initialValue: EMPTY_SAMPLES_PAGE });
  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [phenotypes] = createResource(params, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });
  const metadata = createAsync(() => getMetadata());

  return (
    <>
      <Breadcrumb items={[{ text: "Help" }]} />
      <div class="columns">
        <div class="column">
          <p class="title is-3">Documentation</p>
          <span>The documentation for the Variant Interpretation Pipeline is located </span>
          <Anchor href={`https://molgenis.github.io/vip/`}>
            <span>here</span>
          </Anchor>
          <span>.</span>
        </div>
      </div>
      <Show when={metadata()} fallback={<Loader />}>
        {(metadata) => (
          <Show when={!samples.loading && !records.loading && !phenotypes.loading} fallback={<Loader />}>
            <p class="title is-3">About</p>
            <div class="columns">
              <div class="column">
                <div class="table-container">
                  <table class="table is-narrow">
                    <thead>
                      <tr>
                        <th colSpan={2}>Software metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Name:</th>
                        <td>{metadata()?.app.name}</td>
                      </tr>
                      <tr>
                        <th>Version:</th>
                        <td>{metadata()?.app.version}</td>
                      </tr>
                      <tr>
                        <th>Arguments:</th>
                        <td>{metadata()?.app.args}</td>
                      </tr>
                      <VcfHeaderRow
                        value={getHeaderValue("VIP_Version", metadata().records.lines)}
                        title={"VIP Version"}
                      />
                      <VcfHeaderRow
                        value={getHeaderValue("VIP_Command", metadata().records.lines)}
                        title={"VIP Command"}
                      />
                    </tbody>
                  </table>
                </div>
                <div class="table-container">
                  <table class="table is-narrow">
                    <thead>
                      <tr>
                        <th colSpan={2}>Input metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Filename:</th>
                        <td>{metadata()?.htsFile.uri}</td>
                      </tr>
                      <tr>
                        <th>Assembly:</th>
                        <td>{metadata()?.htsFile.genomeAssembly}</td>
                      </tr>
                      <tr>
                        <th>Number of records:</th>
                        <td>{records().total}</td>
                      </tr>
                      <tr>
                        <th>Number of samples:</th>
                        <td>{samples().total}</td>
                      </tr>
                      <tr>
                        <th>Phenotypes:</th>
                        <td>
                          <For each={phenotypes().items}>
                            {(item: Item<Phenotype>) => (
                              <>
                                <b>{item.data.subject.id}: </b>
                                <For each={item.data.phenotypicFeaturesList}>
                                  {(phenotypicFeature: PhenotypicFeature, i) => (
                                    <>
                                      {i() > 0 ? ", " : ""}
                                      <HpoTerm ontologyClass={phenotypicFeature.type} />
                                    </>
                                  )}
                                </For>
                                <br />
                              </>
                            )}
                          </For>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Show>
        )}
      </Show>
    </>
  );
};
