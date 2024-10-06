import { createFieldMap, MetadataContainer } from "../utils/ApiUtils";
import { VariantType } from "../utils/variantTypeUtils";
import { SampleContainer } from "../utils/sample";
import { createConfigFilterCustom } from "../utils/configFilterUtilsCustom";
import { createConfigFilterFormat, createConfigFilterInfo } from "../utils/configFilterUtils";
import { ConfigFilters } from "../types/config";

export function createConfigFilters(
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
): ConfigFilters {
  let filterConfigs: ConfigFilters;
  if (variantType === null) {
    filterConfigs = createConfigFiltersDefault(metadata, sample);
  } else {
    switch (variantType.id) {
      case "snv":
        filterConfigs = createConfigFiltersSnv(metadata, sample);
        break;
      case "str":
        filterConfigs = createConfigFiltersStr(metadata, sample);
        break;
      case "sv":
        filterConfigs = createConfigFiltersSv(metadata, sample);
        break;
      default:
        throw new Error(`unexpected variant type id '${variantType.id}'`);
    }
  }
  return filterConfigs;
}

function createConfigFiltersSnv(metadata: MetadataContainer, sample: SampleContainer): ConfigFilters {
  return createConfigFiltersDefault(metadata, sample);
}

function createConfigFiltersStr(metadata: MetadataContainer, sample: SampleContainer): ConfigFilters {
  const fieldMap = createFieldMap(metadata.records);
  return [
    createConfigFilterCustom("custom/locus", metadata),
    createConfigFilterInfo("INFO/CSQ/HPO", fieldMap),
    createConfigFilterInfo("INFO/CSQ/GADO_PD", fieldMap),
    createConfigFilterInfo("INFO/CSQ/SYMBOL", fieldMap),
    createConfigFilterInfo("INFO/CSQ/IncompletePenetrance", fieldMap),
    createConfigFilterInfo("INFO/CSQ/VIPC", fieldMap),
    createConfigFilterInfo("INFO/RU", fieldMap),
    createConfigFilterInfo("INFO/STR_STATUS", fieldMap),
    createConfigFilterInfo("INFO/STR_NORMAL_MAX", fieldMap),
    createConfigFilterInfo("INFO/STR_PATHOLOGIC_MIN", fieldMap),
    createConfigFilterFormat("FORMAT/REPCI", fieldMap, sample),
    createConfigFilterFormat("FORMAT/REPCN", fieldMap, sample),
  ].filter((filter) => filter !== null);
}

function createConfigFiltersSv(metadata: MetadataContainer, sample: SampleContainer): ConfigFilters {
  return createConfigFiltersDefault(metadata, sample);
}

function createConfigFiltersDefault(metadata: MetadataContainer, sample: SampleContainer): ConfigFilters {
  const fieldMap = createFieldMap(metadata.records);
  return [
    createConfigFilterCustom("custom/locus", metadata),
    createConfigFilterInfo("INFO/CSQ/HPO", fieldMap),
    createConfigFilterInfo("INFO/CSQ/GADO_PD", fieldMap),
    createConfigFilterInfo("INFO/CSQ/SYMBOL", fieldMap),
    createConfigFilterInfo("INFO/CSQ/IncompletePenetrance", fieldMap),
    createConfigFilterInfo("INFO/CSQ/VIPC", fieldMap),
    createConfigFilterInfo("INFO/CSQ/VKGL_CL", fieldMap),
    createConfigFilterInfo("INFO/CSQ/clinVar_CLNSIG", fieldMap),
    createConfigFilterFormat("FORMAT/VI", fieldMap, sample),
    createConfigFilterFormat("FORMAT/VIC", fieldMap, sample),
    createConfigFilterFormat("FORMAT/VID", fieldMap, sample),
    createConfigFilterFormat("FORMAT/VIG", fieldMap, sample),
    createConfigFilterFormat("FORMAT/VIM", fieldMap, sample),
    createConfigFilterFormat("FORMAT/VIAB", fieldMap, sample),
  ].filter((filter) => filter !== null);
}
