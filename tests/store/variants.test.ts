import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { wrapStore } from "../../src/store/variants.ts";
import { createAppStore } from "../../src/store/app.ts";
import { SampleContainer } from "../../src/utils/api.ts";
import { VariantType } from "../../src/utils/variantType.ts";

describe("variants", () => {
  const consoleLog = console.log;

  beforeAll(() => {
    console.log = () => {};
  });

  afterAll(() => {
    console.log = consoleLog;
  });

  describe("wrapStore", () => {
    const sample = { item: { id: 2 } } as SampleContainer;
    const variantType = { id: "all" } as VariantType;

    describe("setFilterValue", () => {
      test("set new value", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setFilterValue("f", ["val"]);
        expect(store.getFilterValues()).toStrictEqual({ f: ["val"] });
        expect(store.getPageNumber()).toStrictEqual(0);
      });

      test("update value", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setFilterValue("f", ["val"]);
        store.setFilterValue("f", ["val_new"]);
        expect(store.getFilterValues()).toStrictEqual({ f: ["val_new"] });
        expect(store.getPageNumber()).toStrictEqual(0);
      });

      test("set value resets page number", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setPageNumber(2);
        store.setFilterValue("f", ["val"]);
        expect(store.getFilterValues()).toStrictEqual({ f: ["val"] });
        expect(store.getPageNumber()).toStrictEqual(0);
      });

      test("do not mix sample state", () => {
        const appStore = createAppStore();
        const sample0 = { item: { id: 0 } } as SampleContainer;
        const sample1 = { item: { id: 1 } } as SampleContainer;
        const sample0Store = wrapStore(appStore, sample0, variantType);
        const sample1Store = wrapStore(appStore, sample1, variantType);

        sample0Store.setFilterValue("f", ["val0"]);
        sample1Store.setFilterValue("f", ["val1"]);
        expect(sample0Store.getFilterValues()).toStrictEqual({ f: ["val0"] });
        expect(sample1Store.getFilterValues()).toStrictEqual({ f: ["val1"] });
      });

      test("no sample", () => {
        const store = wrapStore(createAppStore(), null, variantType);
        store.setFilterValue("f", ["val"]);
        expect(store.getFilterValues()).toStrictEqual({ f: ["val"] });
        expect(store.getPageNumber()).toStrictEqual(0);
      });
    });

    describe("clearFilter", () => {
      test("clear", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setFilterValue("f", ["val"]);
        store.clearFilter("f");
        expect(store.getFilterValues()).toStrictEqual({});
      });

      test("clear resets page number", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setFilterValue("f", ["val"]);
        store.setPageNumber(2);
        store.clearFilter("f");
        expect(store.getFilterValues()).toStrictEqual({});
        expect(store.getPageNumber()).toStrictEqual(0);
      });
    });

    describe("setPageNumber", () => {
      test("set value", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setPageNumber(0);
        expect(store.getPageNumber()).toStrictEqual(0);
      });
    });

    describe("setPageSize", () => {
      test("set size resets page number", () => {
        const store = wrapStore(createAppStore(), sample, variantType);
        store.setPageNumber(2);
        store.setPageSize(10);
        expect(store.getPageSize()).toStrictEqual(10);
        expect(store.getPageNumber()).toStrictEqual(0);
      });
    });
  });
});
