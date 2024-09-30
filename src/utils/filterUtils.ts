import {
  FilterConfig,
  FilterConfigCustom,
  FilterConfigCustomLocus,
  FilterConfigField,
  FilterConfigFormat,
  FilterId,
} from "../types/filter";
import { createFieldMap, FieldMap, MetadataContainer, parseContigIds, SampleContainer } from "./ApiUtils";
import { Columns } from "../components/SampleRecordsTable";
import { VariantType } from "./variantTypeUtils";

export function createFilterConfigs(
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
): FilterConfig[] {
  let filters: FilterConfig[];
  if (variantType === null) {
    filters = createFiltersDefault(metadata, sample);
  } else {
    switch (variantType.id) {
      case "snv":
        filters = createFiltersSnv(metadata, sample);
        break;
      case "str":
        filters = createFiltersStr(metadata, sample);
        break;
      case "sv":
        filters = createFiltersSv(metadata, sample);
        break;
      default:
        throw new Error(`unexpected variant type id '${variantType.id}'`);
    }
  }
  return filters;
}

function createFilterCustom(id: FilterId, fieldMap: FieldMap, metadata: MetadataContainer): FilterConfigCustom | null {
  let filter: FilterConfigCustom;
  switch (id) {
    case "custom/locus":
      filter = createFilterCustomLocus(id, metadata);
      break;
    default:
      throw new Error(`unexpected custom filter id '${id}'`);
  }
  return filter;
}

function createFilterCustomLocus(id: FilterId, metadata: MetadataContainer): FilterConfigCustomLocus {
  const chromosomes = parseContigIds(metadata.records);
  return { type: "custom", id, chromosomes: chromosomes };
}

function createFilterInfo(id: FilterId, fieldMap: FieldMap): FilterConfigField | null {
  const field = fieldMap[id];
  return field !== undefined ? { type: "info", id, field } : null;
}

function createFilterFormat(id: FilterId, fieldMap: FieldMap, sample: SampleContainer): FilterConfigFormat | null {
  const field = fieldMap[id];
  return field !== undefined ? { type: "format", id, field, sample } : null;
}

function createFiltersSnv(metadata: MetadataContainer, sample: SampleContainer): FilterConfig[] {
  return createFiltersDefault(metadata, sample);
}

function createFiltersStr(metadata: MetadataContainer, sample: SampleContainer): FilterConfig[] {
  const fieldMap = createFieldMap(metadata.records);
  return [
    createFilterCustom("custom/locus", fieldMap, metadata),
    createFilterInfo("INFO/CSQ/HPO", fieldMap),
    createFilterInfo("INFO/CSQ/GADO_PD", fieldMap),
    createFilterInfo("INFO/CSQ/SYMBOL", fieldMap),
    createFilterInfo("INFO/CSQ/IncompletePenetrance", fieldMap),
    createFilterInfo("INFO/CSQ/VIPC", fieldMap),
    createFilterInfo("INFO/RU", fieldMap),
    createFilterInfo("INFO/STR_STATUS", fieldMap),
    createFilterInfo("INFO/STR_NORMAL_MAX", fieldMap),
    createFilterInfo("INFO/STR_PATHOLOGIC_MIN", fieldMap),
    createFilterFormat("FORMAT/REPCI", fieldMap, sample),
    createFilterFormat("FORMAT/REPCN", fieldMap, sample),
  ].filter((filter) => filter !== null);
}

function createFiltersSv(metadata: MetadataContainer, sample: SampleContainer): FilterConfig[] {
  return createFiltersDefault(metadata, sample);
}

function createFiltersDefault(metadata: MetadataContainer, sample: SampleContainer): FilterConfig[] {
  const fieldMap = createFieldMap(metadata.records);
  return [
    createFilterCustom("custom/locus", fieldMap, metadata),
    createFilterInfo("INFO/CSQ/HPO", fieldMap),
    createFilterInfo("INFO/CSQ/GADO_PD", fieldMap),
    createFilterInfo("INFO/CSQ/SYMBOL", fieldMap),
    createFilterInfo("INFO/CSQ/IncompletePenetrance", fieldMap),
    createFilterInfo("INFO/CSQ/VIPC", fieldMap),
    createFilterInfo("INFO/CSQ/VKGL_CL", fieldMap),
    createFilterInfo("INFO/CSQ/clinVar_CLNSIG", fieldMap),
    createFilterFormat("FORMAT/VI", fieldMap, sample),
    createFilterFormat("FORMAT/VIC", fieldMap, sample),
    createFilterFormat("FORMAT/VID", fieldMap, sample),
    createFilterFormat("FORMAT/VIG", fieldMap, sample),
    createFilterFormat("FORMAT/VIM", fieldMap, sample),
    createFilterFormat("FORMAT/VIAB", fieldMap, sample),
  ].filter((filter) => filter !== null);
}

const defaultColumns = [
  {
    fieldId: "INFO/CSQ",
    children: [
      "Consequence",
      "SYMBOL",
      "InheritanceModesGene",
      "HGVSc",
      "HGVSp",
      "CAPICE_SC",
      "VIPC",
      "VKGL_CL",
      "clinVar_CLNSIG",
      "gnomAD_AF",
      "gnomAD_HN",
      "PUBMED",
    ],
  },
];

export function createColumns(variantType: VariantType | null): Columns {
  if (variantType === null) {
    return defaultColumns;
  } else {
    switch (variantType.id) {
      case "snv":
        return defaultColumns;
      case "str":
        return [
          {
            fieldId: "INFO/CSQ",
            children: ["Consequence", "SYMBOL"],
          },
        ];
      case "sv":
        return defaultColumns;
    }
  }
}
