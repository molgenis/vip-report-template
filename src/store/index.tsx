import { hashIntegration, Router } from "solid-app-router";
import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Order } from "../utils/sortUtils";
import { FilterQueries } from "../components/filter/Filters";

// TODO clear store on dataset change
export type AppState = {
  samples: {
    [key: string]: {
      variants: {
        page?: number;
        pageSize?: number;
        searchQuery?: string;
        filterQueries?: FilterQueries;
        sort?: Order | null; // null: do not sort. undefined: sort undefined
      };
    };
  };
};

export type AppActions = {
  setVariantsPage(sample: Item<Sample>, page: number): void;
  setVariantsPageSize(sample: Item<Sample>, pageSize: number): void;
  setVariantsSearchQuery(sample: Item<Sample>, search: string): void;
  clearVariantsSearchQuery(sample: Item<Sample>): void;
  setVariantsFilterQueries(sample: Item<Sample>, filterQueries: FilterQueries): void;
  setVariantsSort(sample: Item<Sample>, order: Order | null): void;
};

export type AppStore = [state: AppState, actions: AppActions];

const defaultState: AppState = { samples: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent<{ value: AppStore }> = (props) => {
  const [state, setState] = createStore(defaultState);
  const actions: AppActions = {
    setVariantsPage(sample: Item<Sample>, page: number) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "page", page);
    },
    setVariantsPageSize(sample: Item<Sample>, pageSize: number) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "pageSize", pageSize);
      setState("samples", sample.id, "variants", "page", 0);
    },
    setVariantsSearchQuery(sample: Item<Sample>, searchQuery: string) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "searchQuery", searchQuery);
      setState("samples", sample.id, "variants", "page", 0);
    },
    clearVariantsSearchQuery(sample: Item<Sample>) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "searchQuery", undefined);
      setState("samples", sample.id, "variants", "page", 0);
    },
    setVariantsFilterQueries(sample: Item<Sample>, filterQueries: FilterQueries) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "filterQueries", filterQueries);
      setState("samples", sample.id, "variants", "page", 0);
    },
    setVariantsSort(sample: Item<Sample>, sort: Order | null) {
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "sort", sort);
    },
  };
  const store: AppStore = [state, actions];

  return (
    <Router source={hashIntegration()}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </Router>
  );
};

export function useStore() {
  return useContext(StoreContext);
}
