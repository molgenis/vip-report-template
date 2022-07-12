import { hashIntegration, Router } from "solid-app-router";
import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item, QueryClause, Sample, Selector, SortOrder } from "@molgenis/vip-report-api/src/Api";
import { selectorKey } from "../utils/query";

export type FilterQueries = { [key: string]: QueryClause | undefined };

type AppStateVariants = {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filterQueries?: FilterQueries;
  sort?: SortOrder | null; // null: do not sort. undefined: sort undefined
  selection: string[];
};

export type AppState = {
  variants?: AppStateVariants;
  samples?: {
    [key: number]: { variants: AppStateVariants };
  };
};

export type AppActions = {
  reset(): void;
  setVariantsPage(page: number): void;
  setVariantsPageSize(pageSize: number): void;
  setVariantsSearchQuery(searchQuery: string): void;
  clearVariantsSearchQuery(): void;
  setVariantsFilterQuery(query: QueryClause): void;
  clearVariantsFilterQuery(selector: Selector): void;
  setVariantsSort(sort: SortOrder | null): void;
  setSampleVariantsPage(sample: Item<Sample>, page: number): void;
  setSampleVariantsPageSize(sample: Item<Sample>, pageSize: number): void;
  setSampleVariantsSearchQuery(sample: Item<Sample>, searchQuery: string): void;
  updateVariantsSelection(sample: Item<Sample>, key: string, action: string): void;
  clearSampleVariantsSearchQuery(sample: Item<Sample>): void;
  setSampleVariantsFilterQuery(sample: Item<Sample>, query: QueryClause): void;
  clearSampleVariantsFilterQuery(sample: Item<Sample>, selector: Selector): void;
  setSampleVariantsSort(sample: Item<Sample>, sort: SortOrder | null): void;
};

export type AppStore = [state: AppState, actions: AppActions];

const defaultState: AppState = { variants: {}, samples: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);

  function getVariants(sample: Item<Sample>) {
    return state.samples ? state.samples[sample.id]?.variants || {} : {};
  }

  const actions: AppActions = {
    reset() {
      setState({ variants: undefined, samples: undefined });
    },
    setVariantsPage(page: number) {
      setState({ variants: { ...(state.variants || {}), page } });
    },
    setVariantsPageSize(pageSize: number) {
      setState({ variants: { ...(state.variants || {}), pageSize } });
    },
    setVariantsSearchQuery(searchQuery: string) {
      setState({ variants: { ...(state.variants || {}), searchQuery } });
    },
    clearVariantsSearchQuery() {
      setState({ variants: { ...(state.variants || {}), searchQuery: undefined } });
    },
    setVariantsFilterQuery(query: QueryClause) {
      setState({
        variants: {
          ...(state.variants || {}),
          filterQueries: {
            ...((state.variants?.filterQueries as FilterQueries) || {}),
            [selectorKey(query.selector)]: query,
          },
        },
      });
    },
    clearVariantsFilterQuery(selector: Selector) {
      setState({
        variants: {
          ...(state.variants || {}),
          filterQueries: { ...(state.variants?.filterQueries || {}), [selectorKey(selector)]: undefined },
        },
      });
    },
    setVariantsSort(sort: SortOrder | null) {
      setState({
        variants: {
          ...(state.variants || {}),
          sort,
        },
      });
    },
    setSampleVariantsPage(sample: Item<Sample>, page: number) {
      setState({ samples: { ...(state.samples || {}), [sample.id]: { variants: { ...getVariants(sample), page } } } });
    },
    setSampleVariantsPageSize(sample: Item<Sample>, pageSize: number) {
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: { variants: { ...getVariants(sample), pageSize, page: undefined } },
        },
      });
    },
    setSampleVariantsSearchQuery(sample: Item<Sample>, searchQuery: string) {
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: { variants: { ...getVariants(sample), searchQuery, page: undefined } },
        },
      });
    },
    clearSampleVariantsSearchQuery(sample: Item<Sample>) {
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: { variants: { ...getVariants(sample), searchQuery: undefined, page: undefined } },
        },
      });
    },
    setSampleVariantsFilterQuery(sample: Item<Sample>, query: QueryClause) {
      const variants = getVariants(sample);
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: {
            variants: {
              ...variants,
              filterQueries: {
                ...((variants.filterQueries as FilterQueries) || {}),
                [selectorKey(query.selector)]: query,
              },
              page: undefined,
            },
          },
        },
      });
    },
    clearSampleVariantsFilterQuery(sample: Item<Sample>, selector: Selector) {
      const variants = getVariants(sample);
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: {
            variants: {
              ...getVariants(sample),
              filterQueries: {
                ...((variants.filterQueries as FilterQueries) || {}),
                [selectorKey(selector)]: undefined,
              },
              page: undefined,
            },
          },
        },
      });
    },
    setSampleVariantsSort(sample: Item<Sample>, sort: SortOrder | null) {
      setState({
        samples: { ...(state.samples || {}), [sample.id]: { variants: { ...getVariants(sample), sort } } },
      });
    },
    updateVariantsSelection(sample: Item<Sample>, key: string, action: "ADD" | "REMOVE") {
      let selection: string[] = state.samples ? Object.assign([], state.samples[sample.id]?.variants.selection) : [];
      if (action === "ADD") {
        if (selection) {
          selection.push(key);
        } else {
          selection = [key];
        }
      } else {
        const index = selection.indexOf(key);
        if (index === -1) {
          throw new Error("Attempting to remove non-existing key from  selection.");
        }
        selection.splice(index, 1);
      }
      setState({
        samples: {
          ...(state.samples || {}),
          [sample.id]: {
            variants: {
              ...getVariants(sample),
              selection,
            },
          },
        },
      });
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
