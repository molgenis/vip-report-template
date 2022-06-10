import { Component, createResource, createSignal, For, Show } from "solid-js";
import { Breadcrumb } from "../components/Breadcrumb";
import { Item, Phenotype, PhenotypicFeature } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "../components/record/info/HpoTerm";
import {
  EMPTY_APP_METADATA,
  EMPTY_HTS_FILE_METADATA,
  EMPTY_PARAMS,
  EMPTY_PHENOTYPES,
  EMPTY_RECORDS_METADATA,
  EMPTY_RECORDS_PAGE,
  EMPTY_SAMPLES_PAGE,
  fetchAppMetadata,
  fetchHtsFileMetadata,
  fetchPhenotypes,
  fetchRecords,
  fetchRecordsMeta,
  fetchSamples,
} from "../utils/ApiUtils";
import { getHeaderValue } from "../utils/viewUtils";
import { Loader } from "../components/Loader";
import { VcfHeaderRow } from "../components/VcfHeaderRow";

export const Home: Component = () => {
  const [params] = createSignal(EMPTY_PARAMS);
  const [samples] = createResource(params, fetchSamples, { initialValue: EMPTY_SAMPLES_PAGE });
  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [recordsMetadata] = createResource(params, fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [phenotypes] = createResource(params, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });
  const [htsFileMetadata] = createResource(params, fetchHtsFileMetadata, { initialValue: EMPTY_HTS_FILE_METADATA });
  const [appMetadata] = createResource(params, fetchAppMetadata, { initialValue: EMPTY_APP_METADATA });

  return (
    <Show
      when={
        !samples.loading &&
        !records.loading &&
        !recordsMetadata.loading &&
        !phenotypes.loading &&
        !htsFileMetadata.loading &&
        !appMetadata.loading
      }
      fallback={<Loader />}
    >
      <Breadcrumb items={[]} />
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
              <td>{appMetadata().name}</td>
            </tr>
            <tr>
              <th>Version:</th>
              <td>{appMetadata().version}</td>
            </tr>
            <tr>
              <th>Arguments:</th>
              <td>{appMetadata().args}</td>
            </tr>
            <VcfHeaderRow
              value={getHeaderValue("VIP_Version", recordsMetadata().lines)}
              title={"VIP Version"}
            ></VcfHeaderRow>
            <VcfHeaderRow
              value={getHeaderValue("VIP_Command", recordsMetadata().lines)}
              title={"VIP Command"}
            ></VcfHeaderRow>
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
              <td>{htsFileMetadata().uri}</td>
            </tr>
            <tr>
              <th>Assembly:</th>
              <td>{htsFileMetadata().genomeAssembly}</td>
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
    </Show>
  );
};
