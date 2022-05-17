import { Component, createResource, createSignal } from "solid-js";
import { Params } from "@molgenis/vip-report-api/src/Api";
import api from "../Api";
import { SampleTable } from "../components/SampleTable";
import { Pager } from "../components/record/Pager";
import { SearchBox } from "../components/SearchBox";
import { Checkbox, CheckboxEvent } from "../components/Checkbox";
import { Breadcrumb } from "../components/Breadcrumb";
import { EMPTY_PARAMS, EMPTY_SAMPLES_PAGE } from "../utils/ApiUtils";

const fetchSamples = async (params: Params) => await api.getSamples(params);

export const Samples: Component = () => {
  const [params, setParams] = createSignal(EMPTY_PARAMS);
  const [samples] = createResource(params, fetchSamples, { initialValue: EMPTY_SAMPLES_PAGE });

  const onPageChange = (page: number) => setParams({ page });
  const onSearchChange = (search: string) =>
    setParams({
      page: 0,
      query: search !== "" ? { selector: ["person", "individualId"], operator: "==", args: search } : undefined,
    });
  const onProbandFilterChange = (event: CheckboxEvent) => {
    setParams({
      page: 0,
      query: event.checked ? { selector: ["proband"], operator: "==", args: event.checked } : undefined,
    });
  };

  return (
    <>
      <Breadcrumb links={[{ href: "#", label: "Samples" }]}></Breadcrumb>
      <div class="columns">
        <div class="column is-4 is-offset-3">
          {!samples.loading && <Pager page={samples().page} onPageChange={onPageChange} />}
        </div>
        <div class="column is-2 is-offset-1">
          {!samples.loading && <span class="is-pulled-right">{samples().page.totalElements} records</span>}
        </div>
      </div>

      <div class="columns">
        <div class="column is-1-fullhd is-2">
          <SearchBox onInput={onSearchChange} />
          <p class="has-text-weight-semibold">Proband</p>
          <div class="field">
            <div class="control">
              <Checkbox value={"proband"} onChange={onProbandFilterChange} />
            </div>
          </div>
        </div>
        <div class="column">{!samples.loading && <SampleTable samples={samples().items} />}</div>
      </div>
    </>
  );
};
