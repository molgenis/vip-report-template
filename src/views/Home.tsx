import { Component, createResource, createSignal, For } from "solid-js";
import { Breadcrumb } from "../components/Breadcrumb";
import api from "../Api";
import { Params } from "../api/Api";

const fetchSamples = async (params: Params) => await api.getSamples(params);
const fetchRecords = async (params: Params) => await api.getRecords(params);
const fetchHtsFileMetadata = async () => await api.getHtsFileMetadata();
const fetchAppMetadata = async () => await api.getAppMetadata();

export const Home: Component = () => {
  const [params, setParams] = createSignal({});
  const [samples] = createResource(params, fetchSamples);
  const [records] = createResource(params, fetchRecords);
  const [htsFileMetadata] = createResource(params, fetchHtsFileMetadata);
  const [appMetadata] = createResource(params, fetchAppMetadata);
  return (
    <>
      <Breadcrumb links={[]}></Breadcrumb>

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
              <td>{appMetadata()?.name}</td>
            </tr>
            <tr>
              <th>Version:</th>
              <td>{appMetadata()?.version}</td>
            </tr>
            <tr>
              <th>Arguments:</th>
              <td>{appMetadata()?.args}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th colSpan={2}>Input file metadata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Filename:</th>
              <td>{htsFileMetadata()?.uri}</td>
            </tr>
            <tr>
              <th>Assembly:</th>
              <td>{htsFileMetadata()?.genomeAssembly}</td>
            </tr>
            <tr>
              <th>Number of records:</th>
              <td>{records()?.total}</td>
            </tr>
            <tr>
              <th>Number of samples:</th>
              <td>{samples()?.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
