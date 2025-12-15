import { SetStoreFunction } from "solid-js/store";
import { VariantTypeId } from "../utils/variantType.ts";
import { SortOrder } from "@molgenis/vip-report-api";
import { FilterValueMap } from "./filter";

export type Page = { number: number; size?: number };
export type Sort = SortOrder | SortOrder[];
export type AppStateVariantType = {
  filterValues?: FilterValueMap;
  page?: Page;
  /**
   * null:      do not sort,                the caller of this function should not fall back to a default sort
   * undefined: sort behavior is undefined, the caller of this function could fall back to a default sort
   */
  sort?: Sort | null;
  filtersInited: boolean;
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
