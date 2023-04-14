import { Component, createSignal, For } from "solid-js";
import api from "../Api";
import { useNavigate } from "@solidjs/router";
import { useStore } from "../store";

export const DatasetDropdown: Component = () => {
  const [, actions] = useStore();

  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = createSignal("GRCh37 Family");

  function switchIt(datasetName: string) {
    setSelectedDataset(datasetName);
    api.selectDataset(datasetName);
    actions.reset();
    (async () => {
      navigate(`/`);
      const samples = await api.getSamples({ query: { selector: ["proband"], operator: "==", args: true } });
      if (samples.page.totalElements === 1) {
        navigate(`/samples/${samples.items[0].id}/variants`);
      } else if (samples.total === 0) {
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
        <For each={api.getDatasetIds()}>
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
