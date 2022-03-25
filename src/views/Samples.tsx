import { Component, createResource, createSignal, Show } from "solid-js";
import { Params } from "../api/Api";
import api from "../Api";
import { SampleTable } from "../components/SampleTable";
import { Pager } from "../components/record/Pager";
import { SearchBox } from "../components/SearchBox";
import { Checkbox, CheckboxEvent } from "../components/Checkbox";
import { Loader } from "../components/Loader";
import { Link } from "solid-app-router";

const fetchSamples = async (params: Params) => await api.getSamples(params);

export const Samples: Component = () => {
  const [params, setParams] = createSignal({});
  const [samples] = createResource(params, fetchSamples);

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
    <Show when={!samples.loading} fallback={<Loader />}>
      <div class="columns is-gapless">
        <div class="column">
          <nav class="breadcrumb">
            <ul>
              <li>
                <Link href="/">
                  <span class="icon">
                    <i class="fa-solid fa-home" />
                  </span>
                </Link>
              </li>
              <li class="is-active">
                <a href="#">Samples</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="columns">
        <div class="column is-4 is-offset-3">
          <Pager page={samples().page} onPageChange={onPageChange} />
        </div>
        <div class="column is-2 is-offset-1">
          <span class="is-pulled-right">{samples().page.totalElements} records</span>
        </div>
      </div>

      <div class="columns">
        <div class="column is-2">
          <SearchBox onInput={onSearchChange} />
          <p class="has-text-weight-semibold">Proband</p>
          <div class="field">
            <div class="control">
              <Checkbox value={"proband"} onChange={onProbandFilterChange} />
            </div>
          </div>
        </div>
        <div class="column">
          <SampleTable samples={samples().items} />
        </div>
      </div>
    </Show>
  );
};
