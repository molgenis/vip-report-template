import { Component, createSignal, For } from "solid-js";
import { query, useNavigate } from "@solidjs/router";
import { useStore } from "../store";
import { getDatasetIds, selectDataset } from "../utils/api.ts";
import { init } from "../App.tsx";

export const DatasetDropdown: Component = () => {
  const navigate = useNavigate();
  const [, actions] = useStore();

  const [selectedDataset, setSelectedDataset] = createSignal("GRCh37 Family");

  function switchIt(datasetName: string) {
    actions.reset();
    query.clear(); // flush cache
    setSelectedDataset(datasetName);
    selectDataset(datasetName);
    init(navigate);
  }

  return (
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link">{selectedDataset()}</a>
      <div class="navbar-dropdown">
        <For each={getDatasetIds()}>
          {(dataset: string) => (
            <a class="navbar-item" onClick={() => switchIt(dataset)}>
              {dataset}
            </a>
          )}
        </For>
      </div>
    </div>
  );
};
