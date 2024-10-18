import { Component, createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useStore } from "../store";
import { fetchSampleProbandIds, getDatasetIds, selectDataset } from "../Api.ts";

export const DatasetDropdown: Component = () => {
  const [, actions] = useStore();

  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = createSignal("GRCh37 Family");

  function switchIt(datasetName: string) {
    setSelectedDataset(datasetName);
    selectDataset(datasetName);
    actions.reset();
    (async () => {
      navigate(`/`);
      const samples = await fetchSampleProbandIds();
      if (samples.length === 1) {
        navigate(`/samples/${samples[0]!}/variants`);
      } else if (samples.length === 0) {
        navigate(`/variants`);
      } else {
        navigate(`/samples`);
      }
    })().catch((err: Error) => console.error(err.stack));
  }

  return (
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link">{selectedDataset()}</a>
      <div class="navbar-dropdown">
        <For each={getDatasetIds()}>
          {(dataset: string) => (
            <a
              class="navbar-item"
              onClick={() => {
                switchIt(dataset);
              }}
            >
              {dataset}
            </a>
          )}
        </For>
      </div>
    </div>
  );
};
