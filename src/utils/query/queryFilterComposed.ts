import {
  ConfigFilterAllelicImbalance,
  ConfigFilterComposed,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  ConfigFilterVipC,
  ConfigFilterVipCS,
  FilterValueAllelicImbalance,
  FilterValueDeNovo,
  FilterValueHpo,
  FilterValueInheritanceMatch,
  FilterValueLocus,
  FilterValueVipC,
  FilterValueVipCS,
} from "../../types/configFilterComposed";
import { FilterValue } from "../../types/configFilter";
import { Query } from "@molgenis/vip-report-api";
import { createQueryComposed } from "./query.ts";
import { createSelectorInfo, createSelectorSample } from "./selector.ts";
import {
  createQueryFilterClosedInterval,
  createQueryFilterClosedIntervalOutside,
  createQueryFilterString,
} from "./queryFilter.ts";
import { createQueryFilterFieldCategorical } from "./queryFilterField.ts";

export function createQueryFilterComposed(filter: ConfigFilterComposed, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.id) {
    case "composed/hpo":
      query = createQueryFilterHpo(filter as ConfigFilterHpo, filterValue as FilterValueHpo);
      break;
    case "composed/locus":
      query = createQueryFilterLocus(filterValue as FilterValueLocus);
      break;
    case "composed/allelicImbalance":
      query = createQueryFilterAllelicImbalance(
        filter as ConfigFilterAllelicImbalance,
        filterValue as FilterValueAllelicImbalance,
      );
      break;
    case "composed/inheritanceMatch":
      query = createQueryFilterInheritanceMatch(
        filter as ConfigFilterInheritanceMatch,
        filterValue as FilterValueInheritanceMatch,
      );
      break;
    case "composed/deNovo":
      query = createQueryFilterDeNovo(filter as ConfigFilterDeNovo, filterValue as FilterValueDeNovo);
      break;
    case "composed/vipC":
      query = createQueryFilterVipC(filter as ConfigFilterVipC, filterValue as FilterValueVipC);
      break;
    case "composed/vipCS":
      query = createQueryFilterVipCS(filter as ConfigFilterVipCS, filterValue as FilterValueVipCS);
      break;
    default:
      throw new Error(`unexpected filter id '${filter.id}'`);
  }
  return query;
}

function createQueryFilterHpo(filter: ConfigFilterHpo, filterValue: FilterValueHpo): Query {
  const field = filter.field;
  const selector = createSelectorInfo(field);
  return createQueryFilterFieldCategorical(selector, field, filterValue);
}

function createQueryFilterLocus(filterValue: FilterValueLocus): Query {
  const queryParts: Query[] = [createQueryFilterString(["c"], [filterValue.chromosome], false)];

  if (filterValue.start !== undefined || filterValue.end !== undefined) {
    const posQuery = createQueryFilterClosedInterval(["p"], { left: filterValue.start, right: filterValue.end });
    queryParts.push(posQuery);
  }

  return createQueryComposed(queryParts, "and");
}

function createQueryFilterAllelicImbalance(
  filter: ConfigFilterAllelicImbalance,
  filterValue: FilterValueAllelicImbalance,
): Query {
  const viabSelector = createSelectorSample(filter.sample, filter.viabField);
  //GT_type is a technical field specific for the database, so no metadata present
  const gtTypeSelector = ["s", filter.sample.item.id, "GT_type"];
  const queryParts: Query[] = [];
  if (filterValue.includes("true")) {
    const queryPartsTrue: Query[] = [];
    queryPartsTrue.push(
      createQueryComposed(
        [
          {
            operator: "in",
            selector: gtTypeSelector,
            args: ["HOM_ALT", "HOM_REF"],
          },
          createQueryFilterClosedInterval(viabSelector, { left: 0.02, right: 0.98 }),
        ],
        "and",
      ),
    );
    queryPartsTrue.push(
      createQueryComposed(
        [
          {
            operator: "==",
            selector: gtTypeSelector,
            args: "HET",
          },
          createQueryFilterClosedIntervalOutside(viabSelector, { left: 0.2, right: 0.8 }),
        ],
        "and",
      ),
    );
    queryParts.push(createQueryComposed(queryPartsTrue, "or"));
  }
  if (filterValue.includes("false")) {
    const queryPartsFalse: Query[] = [];
    queryPartsFalse.push(
      createQueryComposed(
        [
          {
            operator: "in",
            selector: gtTypeSelector,
            args: ["HOM_ALT", "HOM_REF"],
          },
          createQueryFilterClosedIntervalOutside(viabSelector, { left: 0.02, right: 0.98 }),
        ],
        "and",
      ),
    );
    queryPartsFalse.push(
      createQueryComposed(
        [
          {
            operator: "==",
            selector: gtTypeSelector,
            args: "HET",
          },
          createQueryFilterClosedInterval(viabSelector, { left: 0.2, right: 0.8 }),
        ],
        "and",
      ),
    );
    queryParts.push(createQueryComposed(queryPartsFalse, "or"));
  }
  if (filterValue.includes("__null")) {
    const queryPartsUndefined: Query[] = [];
    queryPartsUndefined.push({
      selector: viabSelector,
      operator: "==",
      args: null,
    });
    queryPartsUndefined.push({
      selector: viabSelector,
      operator: "==",
      args: undefined,
    });
    queryParts.push(createQueryComposed(queryPartsUndefined, "or"));
  }
  return createQueryComposed(queryParts, "or");
}

function createQueryFilterInheritanceMatch(
  filter: ConfigFilterInheritanceMatch,
  filterValue: FilterValueInheritanceMatch,
): Query {
  const vimSelector = createSelectorSample(filter.sample, filter.vimField);
  const queryParts: Query[] = [];
  if (filterValue.includes("true")) {
    queryParts.push({
      operator: "==",
      selector: vimSelector,
      args: 1,
    });
  }
  if (filterValue.includes("false")) {
    queryParts.push({
      operator: "==",
      selector: vimSelector,
      args: 0,
    });
  }
  if (filterValue.includes("potential")) {
    const queryPartsUndefined: Query[] = [];
    queryPartsUndefined.push({
      selector: vimSelector,
      operator: "==",
      args: null,
    });
    queryPartsUndefined.push({
      selector: vimSelector,
      operator: "==",
      args: undefined,
    });
    queryParts.push(createQueryComposed(queryPartsUndefined, "or"));
  }
  return createQueryComposed(queryParts, "or");
}

function createQueryFilterDeNovo(filter: ConfigFilterDeNovo, filterValue: FilterValueDeNovo): Query {
  const vidSelector = createSelectorSample(filter.sample, filter.vidField);
  const queryParts: Query[] = [];
  if (filterValue.includes("true")) {
    queryParts.push({
      operator: "==",
      selector: vidSelector,
      args: 1,
    });
  }
  if (filterValue.includes("false")) {
    queryParts.push({
      operator: "==",
      selector: vidSelector,
      args: 0,
    });
  }
  if (filterValue.includes("potential")) {
    const queryPartsUndefined: Query[] = [];
    queryPartsUndefined.push({
      selector: vidSelector,
      operator: "==",
      args: null,
    });
    queryPartsUndefined.push({
      selector: vidSelector,
      operator: "==",
      args: undefined,
    });
    queryParts.push(createQueryComposed(queryPartsUndefined, "or"));
  }
  return createQueryComposed(queryParts, "or");
}

function createQueryFilterVipC(filter: ConfigFilterVipC, filterValue: FilterValueVipC): Query {
  const field = filter.field;
  const selector = createSelectorInfo(field);
  return createQueryFilterFieldCategorical(selector, field, filterValue);
}

function createQueryFilterVipCS(filter: ConfigFilterVipCS, filterValue: FilterValueVipCS): Query {
  const field = filter.field;
  const selector = createSelectorSample(filter.sample, field);
  return createQueryFilterFieldCategorical(selector, field, filterValue);
}
