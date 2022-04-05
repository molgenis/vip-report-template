import { Component, createSignal, For } from "solid-js";
import api from "../Api";
import { useNavigate } from "solid-app-router";
import mockReportData from "../mocks/ReportData";

export const DatasetDropdown: Component = () => {
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = createSignal("Default");

  function switchIt(datasetName: string) {
    setSelectedDataset(datasetName);
    api.switchDataset(datasetName);
    (async () => {
      navigate(`/`);
      const samples = await api.getSamples({ query: { selector: ["proband"], operator: "==", args: true } });
      console.log(samples);
      if (samples.page.totalElements === 1) {
        navigate(`/samples/${samples.items[0].id}/variants`);
      } else if (samples.total === 0) {
        navigate(`/variants`);
      } else {
        navigate(`/samples`);
      }
    })().catch((err) => console.error(err));
  }

  return (
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link">{selectedDataset()}</a>
      <div class="navbar-dropdown">
        <For each={Array.from(mockReportData.keys())}>
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
