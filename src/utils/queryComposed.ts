import {
  ConfigFilterAllelicImbalance,
  ConfigFilterComposed,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  FilterValueAllelicImbalance,
  FilterValueDeNovo,
  FilterValueHpo,
  FilterValueInheritanceMatch,
  FilterValueLocus,
} from "../types/configFilterComposed";
import { FilterValue } from "../types/configFilter";
import { Query } from "@molgenis/vip-report-api";
import {
  createQueryComposed,
  createQueryFilterCategorical,
  createQueryFilterInterval,
  createQueryOusideFilterInterval,
  createSelectorFilterFormat,
  createSelectorFilterInfo,
} from "./query";

export function createQueryFilterComposed(filter: ConfigFilterComposed, filterValue: FilterValue): Query {
  let query: Query;
  switch (filter.id) {
    case "hpo":
      query = createQueryFilterHpo(filter as ConfigFilterHpo, filterValue as FilterValueHpo);
      break;
    case "locus":
      query = createQueryFilterLocus(filterValue as FilterValueLocus);
      break;
    case "allelicImbalance":
      query = createQueryFilterAllelicImbalance(
        filter as ConfigFilterAllelicImbalance,
        filterValue as FilterValueAllelicImbalance,
      );
      break;
    case "inheritanceMatch":
      query = createQueryFilterInheritanceMatch(
        filter as ConfigFilterInheritanceMatch,
        filterValue as FilterValueInheritanceMatch,
      );
      break;
    case "deNovo":
      query = createQueryFilterDeNovo(filter as ConfigFilterDeNovo, filterValue as FilterValueDeNovo);
      break;
    default:
      throw new Error(`unexpected filter id '${filter.id}'`);
  }
  return query;
}

function createQueryFilterHpo(filter: ConfigFilterHpo, filterValue: FilterValueHpo): Query {
  const field = filter.field;
  const selector = createSelectorFilterInfo(field);
  return createQueryFilterCategorical(selector, field, filterValue);
}

function createQueryFilterLocus(filterValue: FilterValueLocus): Query {
  const queryParts: Query[] = [
    {
      operator: "==",
      selector: "c",
      args: filterValue.chromosome,
    },
  ];
  if (filterValue.start !== undefined) {
    queryParts.push({
      operator: ">=",
      selector: "p",
      args: filterValue.start,
    });
  }
  if (filterValue.end !== undefined) {
    queryParts.push({
      operator: "<=",
      selector: "p",
      args: filterValue.end,
    });
  }
  return createQueryComposed(queryParts, "and");
}

function createQueryFilterAllelicImbalance(
  filter: ConfigFilterAllelicImbalance,
  filterValue: FilterValueAllelicImbalance,
): Query {
  const viabSelector = createSelectorFilterFormat({ ...filter, field: filter.viabField });
  const gtSelector = ["s", filter.sample.item.data.index, "GT", "t"];
  const queryParts: Query[] = [];
  if (filterValue.includes("true")) {
    const queryPartsTrue: Query[] = [];
    queryPartsTrue.push(
      createQueryComposed(
        [
          {
            operator: "in",
            selector: gtSelector,
            args: ["hom_a", "hom_r"],
          },
          createQueryFilterInterval(viabSelector, { left: 0.02, right: 0.98 }),
        ],
        "and",
      ),
    );
    queryPartsTrue.push(
      createQueryComposed(
        [
          {
            operator: "==",
            selector: gtSelector,
            args: "het",
          },
          createQueryOusideFilterInterval(viabSelector, { left: 0.2, right: 0.8 }),
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
            selector: gtSelector,
            args: ["hom_a", "hom_r"],
          },
          createQueryOusideFilterInterval(viabSelector, { left: 0.02, right: 0.98 }),
        ],
        "and",
      ),
    );
    queryPartsFalse.push(
      createQueryComposed(
        [
          {
            operator: "==",
            selector: gtSelector,
            args: "het",
          },
          createQueryFilterInterval(viabSelector, { left: 0.2, right: 0.8 }),
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
  const vimSelector = createSelectorFilterFormat({ ...filter, field: filter.vimField });
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
  return createQueryComposed(queryParts, "and");
}

function createQueryFilterDeNovo(filter: ConfigFilterDeNovo, filterValue: FilterValueDeNovo): Query {
  const vidSelector = createSelectorFilterFormat({ ...filter, field: filter.vidField });
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
  return createQueryComposed(queryParts, "and");
}
