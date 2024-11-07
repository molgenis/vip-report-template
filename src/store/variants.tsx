import { VariantType } from "../utils/variantTypeUtils.ts";
import { SampleContainer } from "../Api.ts";
import { AppState, AppStateVariantType, AppStateVariantTypes, AppStore, Page, Sort } from "./index.tsx";
import { FilterValueMap } from "../types/filter";
import { FilterId, FilterValue } from "../types/configFilter";
import { produce } from "solid-js/store";

export type VariantStore = {
  getFilterValues(): FilterValueMap;
  setFilterValue(id: FilterId, value: FilterValue): void;
  clearFilter(id: FilterId): void;
  getPageNumber(): number | null;
  setPageNumber(pageNumber: number): void;
  getPageSize(): number | null;
  setPageSize(pageSize: number): void;
  getSort(): Sort | null;
  setSort(sort: Sort): void;
  clearSort(): void;
};

export function wrapStore(store: AppStore, sample: SampleContainer | null, variantType: VariantType) {
  const [state, , setState] = store;

  function getVariantsState(state: AppState): AppStateVariantType {
    let stateVariantTypes: AppStateVariantTypes;

    if (sample !== null) {
      const sampleVariantsState = state.sampleVariants;

      // get sample
      const sampleKey = sample.item.id.toString();
      if (sampleKey in sampleVariantsState) {
        stateVariantTypes = sampleVariantsState[sampleKey]!;
      } else {
        stateVariantTypes = {};
      }
    } else {
      stateVariantTypes = state.variants;
    }

    // get variant type
    let stateVariantType: AppStateVariantType;
    const variantTypeKey = variantType.id;
    if (variantTypeKey in stateVariantTypes) {
      stateVariantType = stateVariantTypes[variantTypeKey]!;
    } else {
      stateVariantType = {};
    }

    return stateVariantType;
  }

  function getCreateVariantsState(state: AppState): AppStateVariantType {
    let stateVariantTypes: AppStateVariantTypes;

    if (sample !== null) {
      const sampleVariantsState = state.sampleVariants;

      // get/create sample
      const sampleKey = sample.item.id.toString();
      if (sampleKey in sampleVariantsState) {
        stateVariantTypes = sampleVariantsState[sampleKey]!;
      } else {
        stateVariantTypes = {};
        sampleVariantsState[sampleKey] = stateVariantTypes;
      }
    } else {
      stateVariantTypes = state.variants;
    }

    // get/create variant type
    let stateVariantType: AppStateVariantType;
    const variantTypeKey = variantType.id;
    if (variantTypeKey in stateVariantTypes) {
      stateVariantType = stateVariantTypes[variantTypeKey]!;
    } else {
      stateVariantType = {};
      stateVariantTypes[variantTypeKey] = stateVariantType;
    }

    return stateVariantType;
  }

  function getCreateVariantsStatePage(state: AppState): Page {
    const stateVariantType: AppStateVariantType = getCreateVariantsState(state);
    let page = stateVariantType.page;
    if (page === undefined) {
      page = { number: 0, size: 10 };
      stateVariantType.page = page;
    }
    return page;
  }

  function getCreateVariantsStateFilterValues(state: AppState): FilterValueMap {
    const stateVariantType: AppStateVariantType = getCreateVariantsState(state);
    let filterValues = stateVariantType.filterValues;
    if (filterValues === undefined) {
      filterValues = {};
      stateVariantType.filterValues = {};
    }
    return filterValues;
  }

  return {
    getFilterValues(): FilterValueMap {
      return getVariantsState(state).filterValues || {};
    },
    setFilterValue(id: FilterId, value: FilterValue) {
      setState(
        produce((state) => {
          const filterValueMap = getCreateVariantsStateFilterValues(state);
          filterValueMap[id] = value;

          const page = getCreateVariantsStatePage(state);
          page.number = 0;
        }),
      );
      console.log("state change", JSON.stringify(state));
    },
    clearFilter(id: FilterId) {
      setState(
        produce((state) => {
          const filterValueMap = getCreateVariantsStateFilterValues(state);
          delete filterValueMap[id];

          const page = getCreateVariantsStatePage(state);
          page.number = 0;
        }),
      );
    },
    getPageNumber(): number | null {
      return getVariantsState(state).page?.number || null;
    },
    setPageNumber(pageNumber: number) {
      setState(
        produce((state) => {
          const page = getCreateVariantsStatePage(state);
          page.number = pageNumber;
        }),
      );
      console.log("state change", JSON.stringify(state));
    },
    getPageSize(): number | null {
      return getVariantsState(state).page?.size || null;
    },
    setPageSize(pageSize: number) {
      setState(
        produce((state) => {
          const variantsState = getCreateVariantsState(state);
          variantsState.page = { number: 0, size: pageSize };
        }),
      );
      console.log("state change", JSON.stringify(state));
    },
    getSort(): Sort | null {
      return getVariantsState(state).sort || null;
    },
    setSort(sort: Sort) {
      setState(
        produce((state) => {
          const variantsState = getCreateVariantsState(state);
          variantsState.sort = sort;
        }),
      );
      console.log("state change", JSON.stringify(state));
    },
    clearSort() {
      setState(
        produce((state) => {
          const variantsState = getCreateVariantsState(state);
          delete variantsState.sort;
        }),
      );
    },
  };
}