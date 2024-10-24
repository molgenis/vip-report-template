import { Component, createResource, Show } from "solid-js";
import { SampleTable } from "../components/SampleTable";
import { PageChangeEvent, Pager } from "../components/Pager";
import { SearchBox } from "../components/SearchBox";
import { Breadcrumb } from "../components/Breadcrumb";
import { useStore } from "../store";
import { Params, Query, QueryClause } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "../components/Loader";
import { fetchSamples } from "../Api.ts";
import { Checkbox, CheckboxEvent } from "../components/form/Checkbox.tsx";

export const Samples: Component = () => {
  const [state, actions] = useStore();

  function getStateSamples() {
    return state.samples ? state.samples : undefined;
  }

  if (getStateSamples()?.page === undefined) {
    actions.setSamplePage(0);
  }

  const onPageChange = (event: PageChangeEvent) => actions.setSamplePage(event.page);
  const onSearchChange = (search: string) => {
    actions.setSampleSearchQuery(search);
    actions.setSamplePage(0);
  };
  const onProbandFilterChange = (event: CheckboxEvent) => {
    actions.setSampleProbandFilterValue(event.checked);
    actions.setSamplePage(0);
  };

  function createQuery(search: string | undefined, probandFilterValue: boolean | undefined): Query | null {
    const searchQuery: QueryClause | undefined =
      search !== undefined && search !== ""
        ? { selector: ["person", "individualId"], operator: "~=", args: search }
        : undefined;
    const probandQuery: QueryClause | undefined =
      probandFilterValue !== undefined && probandFilterValue
        ? { selector: ["proband"], operator: "==", args: probandFilterValue }
        : undefined;
    if (searchQuery !== undefined || probandQuery != undefined) {
      const args: QueryClause[] = [];
      if (searchQuery !== undefined) {
        args.push(searchQuery);
      }
      if (probandQuery !== undefined) {
        args.push(probandQuery);
      }
      if (args.length > 0) {
        return {
          operator: "and",
          args: args,
        };
      }
    }
    return null;
  }

  const params = (): Params => {
    return {
      query: createQuery(searchQuery(), probandFilterValue()) || undefined,
      page: page() || undefined,
    };
  };

  const page = () => getStateSamples()?.page;
  const searchQuery = () => getStateSamples()?.searchQuery;
  const probandFilterValue = () => getStateSamples()?.probandFilterValue;

  const [samples] = createResource(params, fetchSamples);

  return (
    <>
      <Breadcrumb items={[{ text: "Samples" }]} />
      <div class="columns is-centered">
        <div class="column is-three-quarters-widescreen">
          <p class="title is-2">Samples</p>
          <p class="subtitle is-4">Explore samples and sample variants</p>
          <Show when={samples()} fallback={<Loader />} keyed>
            {(samples) => (
              <>
                <div class="columns">
                  <div class="column is-4 is-offset-3">{<Pager page={samples.page} onPageChange={onPageChange} />}</div>
                  <div class="column is-2 is-offset-1">
                    {<span class="is-pulled-right">{samples.page.totalElements} records</span>}
                  </div>
                </div>

                <div class="columns">
                  <div class="column is-2-widescreen is-3">
                    <SearchBox onInput={onSearchChange} value={state.samples?.searchQuery} />
                    <p class="has-text-weight-semibold">Proband</p>
                    <div class="field">
                      <div class="control">
                        <Checkbox
                          value={"proband"}
                          onChange={onProbandFilterChange}
                          checked={state.samples?.probandFilterValue}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <SampleTable samples={samples.items} />
                  </div>
                </div>
              </>
            )}
          </Show>
        </div>
      </div>
    </>
  );
};
