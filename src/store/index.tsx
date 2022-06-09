import { hashIntegration, Router } from "solid-app-router";
import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Order } from "../utils/sortUtils";
import { Filters } from "../components/filter/Filters";

// TODO clear store on dataset change
export type AppState = {
  samples: {
    [key: string]: {
      variants: {
        page?: number | null;
        pageSize?: number | null;
        searchQuery?: string | null;
        filters?: Filters;
        sort?: Order | null;
      };
    };
  };
};

export type AppActions = {
  setVariantsPage(sample: Item<Sample>, page: number | null): void;
  setVariantsSearchQuery(sample: Item<Sample>, search: string | null): void;
  setVariantsFilters(sample: Item<Sample>, filters: Filters): void;
  setVariantsSort(sample: Item<Sample>, order: Order | null): void;
};

export type AppStore = [state: AppState, actions: AppActions];

const defaultState: AppState = { samples: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);
  const actions = {
    setVariantsPage(sample: Item<Sample>, page: number | null) {
      console.log("setVariantsPage", sample.id, page);
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "page", page);
    },
    setVariantsPageSize(sample: Item<Sample>, pageSize: number | null) {
      console.log("setVariantsPageSize", sample.id, pageSize);
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "pageSize", pageSize);
      setState("samples", sample.id, "variants", "page", null);
    },
    setVariantsSearchQuery(sample: Item<Sample>, searchQuery: string | null) {
      console.log("setVariantsSearchQuery", sample.id, searchQuery);
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "searchQuery", searchQuery);
      setState("samples", sample.id, "variants", "page", null);
    },
    setVariantsFilters(sample: Item<Sample>, filters: Filters) {
      console.log("setVariantsFilters", sample.id, filters);
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "filters", filters);
      setState("samples", sample.id, "variants", "page", null);
    },
    setVariantsSort(sample: Item<Sample>, sort: Order | null) {
      console.log("setVariantsSort", sample.id, sort);
      if (!(sample.id in state.samples)) setState({ samples: { [sample.id]: { variants: {} } } });
      setState("samples", sample.id, "variants", "sort", sort);
    },
  };
  const store = [state, actions];

  return (
    <Router source={hashIntegration()}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </Router>
  );
};

export function useStore() {
  return useContext(StoreContext);
}
