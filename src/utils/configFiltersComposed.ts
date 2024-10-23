import { ConfigFilterComposed, ConfigFilterHpo, ConfigFilterLocus } from "../types/configFilterComposed";
import { UnexpectedEnumValueException } from "./error";
import { FieldMap, parseContigIds } from "./utils.ts";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { ConfigStaticFieldComposed } from "../types/config";

export function createConfigFilterComposed(
  configStatic: ConfigStaticFieldComposed,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterComposed | null {
  const id = configStatic.name;
  let filter: ConfigFilterComposed | null;
  switch (id) {
    case "hpo":
      filter = createConfigFilterHpo(configStatic, sample, fieldMap);
      break;
    case "locus":
      filter = createConfigFilterLocus(configStatic, metadata);
      break;
    default:
      throw new UnexpectedEnumValueException(id);
  }
  return filter;
}

function createConfigFilterHpo(
  configStatic: ConfigStaticFieldComposed,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterHpo | null {
  if (sample === null || sample.phenotypes.length === 0) return null;

  const fieldCsqHpo = fieldMap["INFO/CSQ/HPO"];
  if (fieldCsqHpo === undefined) return null;

  const filterField = {
    // create field with categories based on the sample hpo terms
    ...fieldCsqHpo,
    categories: sample.phenotypes.reduce(
      (acc, phenotype) => ({
        ...acc,
        [phenotype.type.id]: { label: phenotype.type.label },
      }),
      {},
    ),
  };

  return {
    type: "composed",
    id: configStatic.name,
    label: () => configStatic.label || filterField.label || "HPO",
    description: () => configStatic.description || filterField.description || null,
    field: filterField,
  };
}

function createConfigFilterLocus(
  configStatic: ConfigStaticFieldComposed,
  metadata: MetadataContainer,
): ConfigFilterLocus {
  return {
    type: "composed",
    id: configStatic.name,
    label: () => configStatic.label || "Locus",
    description: () => configStatic.description || null,
    chromosomes: parseContigIds(metadata.records),
  };
}
