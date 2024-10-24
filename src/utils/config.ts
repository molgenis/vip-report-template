import { VariantType } from "./variantTypeUtils";
import { Config, ConfigStatic, ConfigStaticField, ConfigStaticVariantTypeFields } from "../types/config";
import { createConfigFilters } from "./configFilters";
import { createConfigFields } from "./configFields";
import config from "../config/config.json";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { createFieldMap, FieldMap } from "./utils.ts";

export function createConfig(
  metadata: MetadataContainer,
  variantType: VariantType,
  sample: SampleContainer | null,
): Config {
  const fieldMap = createFieldMap(metadata.records);

  let configStatic: ConfigStatic;
  if (sample !== null) {
    configStatic = config as unknown as ConfigStatic;
  } else {
    configStatic = createConfigStatic(metadata);
  }

  return {
    cells: createConfigFieldsVariantType(configStatic.cells, variantType, sample, fieldMap),
    filters: createConfigFiltersVariantType(configStatic.filters, variantType, metadata, sample, fieldMap),
  };
}

function createConfigFieldsVariantType(
  configFields: ConfigStaticVariantTypeFields,
  variantType: VariantType,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
) {
  const configStaticFields =
    configFields.variantType && configFields.variantType[variantType.id] !== undefined
      ? configFields.variantType[variantType.id]
      : configFields.default;
  return createConfigFields(configStaticFields, fieldMap, sample, variantType);
}

function createConfigFiltersVariantType(
  configFilters: ConfigStaticVariantTypeFields,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
) {
  const configStaticFields =
    configFilters.variantType && configFilters.variantType[variantType.id] !== undefined
      ? configFilters.variantType[variantType.id]
      : configFilters.default;
  return createConfigFilters(configStaticFields, metadata, sample, fieldMap);
}

function createConfigStatic(metadata: MetadataContainer): ConfigStatic {
  const cells: ConfigStaticField[] = [
    { type: "composed", name: "locus" },
    { type: "fixed", name: "id" },
    { type: "fixed", name: "ref" },
    { type: "fixed", name: "alt" },
    { type: "fixed", name: "qual" },
    { type: "fixed", name: "filter" },
  ];

  const cellsInfo: ConfigStaticField[] = Object.values(metadata.records.info).map((infoMetadata) =>
    infoMetadata.nested
      ? {
          type: "group",
          fields: infoMetadata.nested.items.map((childInfoMetadata) => ({
            type: "info",
            name: `${infoMetadata.id}/${childInfoMetadata.id}`,
          })),
        }
      : {
          type: "info",
          name: infoMetadata.id,
        },
  );

  cells.push(...cellsInfo);

  const filters: ConfigStaticField[] = [
    {
      type: "composed",
      name: "locus",
    },
    { type: "fixed", name: "id" },
    { type: "fixed", name: "ref" },
    { type: "fixed", name: "alt" },
    { type: "fixed", name: "qual" },
    { type: "fixed", name: "filter" },
  ];

  const filtersInfo: ConfigStaticField[] = Object.values(metadata.records.info).flatMap((infoMetadata) =>
    infoMetadata.nested
      ? infoMetadata.nested.items.map((childInfoMetadata) => ({
          type: "info",
          name: `${infoMetadata.id}/${childInfoMetadata.id}`,
        }))
      : [
          {
            type: "info",
            name: infoMetadata.id,
          },
        ],
  );
  filters.push(...filtersInfo);

  return {
    cells: {
      default: cells,
    },
    filters: {
      default: filters,
    },
  };
}
