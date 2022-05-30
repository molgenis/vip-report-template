import { Component, createResource, createSignal, For } from "solid-js";
import { Breadcrumb } from "../components/Breadcrumb";
import { Item, Phenotype, PhenotypicFeature } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "../components/record/info/HpoTerm";
import {
  EMPTY_APP_METADATA,
  EMPTY_HTS_FILE_METADATA,
  EMPTY_PARAMS,
  EMPTY_PHENOTYPES,
  EMPTY_RECORDS_PAGE,
  EMPTY_SAMPLES_PAGE,
  fetchAppMetadata,
  fetchHtsFileMetadata,
  fetchPhenotypes,
  fetchRecords,
  fetchSamples,
} from "../utils/ApiUtils";

export const Home: Component = () => {
  const [params] = createSignal(EMPTY_PARAMS);
  const [samples] = createResource(params, fetchSamples, { initialValue: EMPTY_SAMPLES_PAGE });
  const [records] = createResource(params, fetchRecords, { initialValue: EMPTY_RECORDS_PAGE });
  const [phenotypes] = createResource(params, fetchPhenotypes, { initialValue: EMPTY_PHENOTYPES });
  const [htsFileMetadata] = createResource(params, fetchHtsFileMetadata, { initialValue: EMPTY_HTS_FILE_METADATA });
  const [appMetadata] = createResource(params, fetchAppMetadata, { initialValue: EMPTY_APP_METADATA });

  return (
    <>
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
    </>
  );
};
