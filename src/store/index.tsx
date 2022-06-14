import { hashIntegration, Router } from "solid-app-router";
import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item, QueryClause, Sample, Selector, SortOrder } from "@molgenis/vip-report-api/src/Api";
import { selectorKey } from "../utils/query";

export type FilterQueries = { [key: string]: QueryClause | undefined };

// TODO clear store on dataset change
export type AppState = {
  samples: {
    [key: string]: {
      variants: {
        page?: number;
        pageSize?: number;
        searchQuery?: string;
        filterQueries?: FilterQueries;
        sort?: SortOrder | null; // null: do not sort. undefined: sort undefined
      };
    };
  };
};

export type AppActions = {
  setVariantsPage(sample: Item<Sample>, page: number): void;
  setVariantsPageSize(sample: Item<Sample>, pageSize: number): void;
  setVariantsSearchQuery(sample: Item<Sample>, search: string): void;
  clearVariantsSearchQuery(sample: Item<Sample>): void;
  setVariantsFilterQuery(sample: Item<Sample>, query: QueryClause): void;
  clearVariantsFilterQuery(sample: Item<Sample>, selector: Selector): void;
  setVariantsSort(sample: Item<Sample>, order: SortOrder | null): void;
};

export type AppStore = [state: AppState, actions: AppActions];

const defaultState: AppState = { samples: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent<{ value: AppStore }> = (props) => {
  const [state, setState] = createStore(defaultState);

  function getVariants(sample: Item<Sample>) {
    return state.samples[sample.id]?.variants || {};
  }

  const actions: AppActions = {
    setVariantsPage(sample: Item<Sample>, page: number) {
      setState({ samples: { [sample.id]: { variants: { ...getVariants(sample), page } } } });
    },
    setVariantsPageSize(sample: Item<Sample>, pageSize: number) {
      setState({
        samples: { [sample.id]: { variants: { ...getVariants(sample), pageSize, page: undefined } } },
      });
    },
    setVariantsSearchQuery(sample: Item<Sample>, searchQuery: string) {
      setState({
        samples: { [sample.id]: { variants: { ...getVariants(sample), searchQuery, page: undefined } } },
      });
    },
    clearVariantsSearchQuery(sample: Item<Sample>) {
      setState({
        samples: {
          [sample.id]: { variants: { ...getVariants(sample), searchQuery: undefined, page: undefined } },
        },
      });
    },
    setVariantsFilterQuery(sample: Item<Sample>, query: QueryClause) {
      const variants = getVariants(sample);
      setState({
        samples: {
          [sample.id]: {
            variants: {
              ...variants,
              filterQueries: { ...(variants.filterQueries || {}), [selectorKey(query.selector)]: query },
              page: undefined,
            },
          },
        },
      });
    },
    clearVariantsFilterQuery(sample: Item<Sample>, selector: Selector) {
      const variants = getVariants(sample);
      setState({
        samples: {
          [sample.id]: {
            variants: {
              ...getVariants(sample),
              filterQueries: { ...(variants.filterQueries || {}), [selectorKey(selector)]: undefined },
              page: undefined,
            },
          },
        },
      });
    },
    setVariantsSort(sample: Item<Sample>, sort: SortOrder | null) {
      setState({
        samples: { [sample.id]: { variants: { ...getVariants(sample), sort } } },
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
