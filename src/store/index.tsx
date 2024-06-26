import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Item, Query, Sample, SortOrder } from "@molgenis/vip-report-api/src/Api";

export type FilterQueries = { [key: string]: Query | undefined };

type AppStateVariants = {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filterQueries?: FilterQueries;
  sort?: SortOrder | null; // null: do not sort. undefined: sort undefined
};

type AppStateSamples = {
  page?: number;
  searchQuery?: string;
  probandFilterValue?: boolean;
};

export type AppState = {
  variants?: AppStateVariants;
  sampleVariants?: {
    [key: number]: { variants: AppStateVariants };
  };
  samples?: AppStateSamples;
};

export type AppActions = {
  reset(): void;
  setVariantsPage(page: number): void;
  setVariantsPageSize(pageSize: number): void;
  setVariantsSearchQuery(searchQuery: string): void;
  setVariantsFilterQuery(query: Query, key: string): void;
  clearVariantsFilterQuery(key: string): void;
  setVariantsSort(sort: SortOrder | null): void;
  setSampleVariantsPage(sample: Item<Sample>, page: number): void;
  setSampleVariantsPageSize(sample: Item<Sample>, pageSize: number): void;
  setSampleVariantsSearchQuery(sample: Item<Sample>, searchQuery: string): void;
  setSampleVariantsFilterQuery(sample: Item<Sample>, query: Query, key: string): void;
  clearSampleVariantsFilterQuery(sample: Item<Sample>, key: string): void;
  setSampleVariantsSort(sample: Item<Sample>, sort: SortOrder | null): void;
  setSamplePage(page: number): void;
  setSampleSearchQuery(searchQuery: string): void;
  setSampleProbandFilterValue(probandFilterValue: boolean): void;
};

export type AppStore = [state: AppState, actions: AppActions];

const defaultState: AppState = { variants: {}, sampleVariants: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);

  function getVariants(sample: Item<Sample>) {
    return state.sampleVariants ? state.sampleVariants[sample.id]?.variants || {} : {};
  }

  const actions: AppActions = {
    reset() {
      setState({ variants: undefined, sampleVariants: undefined, samples: undefined });
    },
    setVariantsPage(page: number) {
      setState({ variants: { ...(state.variants || {}), page } });
    },
    setVariantsPageSize(pageSize: number) {
      setState({ variants: { ...(state.variants || {}), pageSize, page: undefined } });
    },
    setVariantsSearchQuery(searchQuery: string) {
      setState({ variants: { ...(state.variants || {}), searchQuery, page: undefined } });
    },
    setVariantsFilterQuery(query: Query, key: string) {
      setState({
        variants: {
          ...(state.variants || {}),
          filterQueries: { ...(state.variants?.filterQueries || {}), [key]: query },
          page: undefined,
        },
      });
    },
    clearVariantsFilterQuery(key: string) {
      setState({
        variants: {
          ...(state.variants || {}),
          filterQueries: { ...(state.variants?.filterQueries || {}), [key]: undefined },
          page: undefined,
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
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: { variants: { ...getVariants(sample), page } },
        },
      });
    },
    setSampleVariantsPageSize(sample: Item<Sample>, pageSize: number) {
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: { variants: { ...getVariants(sample), pageSize, page: undefined } },
        },
      });
    },
    setSampleVariantsSearchQuery(sample: Item<Sample>, searchQuery: string) {
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: { variants: { ...getVariants(sample), searchQuery, page: undefined } },
        },
      });
    },
    setSampleVariantsFilterQuery(sample: Item<Sample>, query: Query, key: string) {
      const variants = getVariants(sample);
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: {
            variants: {
              ...variants,
              filterQueries: { ...(variants.filterQueries || {}), [key]: query },
              page: undefined,
            },
          },
        },
      });
    },
    clearSampleVariantsFilterQuery(sample: Item<Sample>, key: string) {
      const variants = getVariants(sample);
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: {
            variants: {
              ...getVariants(sample),
              filterQueries: { ...(variants.filterQueries || {}), [key]: undefined },
              page: undefined,
            },
          },
        },
      });
    },
    setSampleVariantsSort(sample: Item<Sample>, sort: SortOrder | null) {
      setState({
        sampleVariants: {
          ...(state.sampleVariants || {}),
          [sample.id]: { variants: { ...getVariants(sample), sort } },
        },
      });
    },
    setSamplePage(page: number) {
      setState({ samples: { ...(state.samples || {}), page } });
    },
    setSampleSearchQuery(searchQuery: string) {
      setState({ samples: { ...(state.samples || {}), searchQuery, page: undefined } });
    },
    setSampleProbandFilterValue(probandFilterValue: boolean) {
      setState({ samples: { ...(state.samples || {}), probandFilterValue, page: undefined } });
    },
  };
  const store: AppStore = [state, actions];

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
};

export function useStore() {
  return useContext(StoreContext);
}
