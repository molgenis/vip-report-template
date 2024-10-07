import { VariantType } from "./variantTypeUtils";
import { createFieldMap, FieldMap, MetadataContainer } from "./ApiUtils";
import { SampleContainer } from "./sample";
import { Config, ConfigStatic, ConfigStaticVariantTypeFields } from "../types/config";
import { createConfigFilters } from "./configFilters";
import { createConfigFields } from "./configFields";
import config from "../config/config.json";

export function createConfig(
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
): Config {
  const configTyped = config as ConfigStatic; // TODO can we do this in import statement?

  const fieldMap = createFieldMap(metadata.records);

  return {
    fields: createConfigFieldsVariantType(configTyped.fields, variantType, sample, fieldMap),
    filters: createConfigFiltersVariantType(configTyped.filters, variantType, metadata, sample, fieldMap),
  };
}

function createConfigFieldsVariantType(
  configFields: ConfigStaticVariantTypeFields,
  variantType: VariantType | null,
  sample: SampleContainer,
  fieldMap: FieldMap,
) {
  const configStaticFields =
    variantType !== null && configFields.variantType[variantType.id] !== undefined
      ? configFields.variantType[variantType.id]
      : configFields.default;
  return createConfigFields(configStaticFields, fieldMap, sample);
}

function createConfigFiltersVariantType(
  configFilters: ConfigStaticVariantTypeFields,
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
  fieldMap: FieldMap,
) {
  const configStaticFields =
    variantType !== null && configFilters.variantType[variantType.id] !== undefined
      ? configFilters.variantType[variantType.id]
      : configFilters.default;
  return createConfigFilters(configStaticFields, metadata, sample, fieldMap);
}
