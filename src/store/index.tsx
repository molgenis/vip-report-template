import { Context, createContext, ParentComponent, useContext } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { SortOrder } from "@molgenis/vip-report-api";
import { FilterValueMap } from "../types/filter";
import { VariantTypeId } from "../utils/variantTypeUtils";

export type Page = { number: number; size: number };
export type Sort = SortOrder | SortOrder[];

export type AppStateVariantType = {
  filterValues?: FilterValueMap;
  page?: { number: number; size: number };
  sort?: SortOrder | SortOrder[];
};

export type AppStateVariantTypes = Partial<Record<VariantTypeId, AppStateVariantType>>;

type AppStateSamples = {
  page?: number;
  searchQuery?: string;
  probandFilterValue?: boolean;
};

export type AppState = {
  variants: AppStateVariantTypes;
  sampleVariants: Record<string, AppStateVariantTypes>;
  samples: AppStateSamples;
};

export type AppActions = {
  reset(): void;
  setSamplePage(page: number): void;
  setSampleSearchQuery(searchQuery: string): void;
  setSampleProbandFilterValue(probandFilterValue: boolean): void;
};

export type AppStore = [state: AppState, actions: AppActions, setState: SetStoreFunction<AppState>];

const defaultState: AppState = { variants: {}, sampleVariants: {}, samples: {} };

const StoreContext = createContext<AppStore>() as Context<AppStore>;

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore(defaultState);

  const actions: AppActions = {
    reset() {
      setState({ variants: undefined, sampleVariants: undefined, samples: undefined });
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
  const store: AppStore = [state, actions, setState];

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
};

export function useStore() {
  return useContext(StoreContext);
}
