import { FilterId } from "../types/configFilter";
import { ConfigFilterComposed, ConfigFilterHpo, ConfigFilterLocus } from "../types/configFilterComposed";
import { CellId } from "../types/configCell";
import { UnexpectedEnumValueException } from "./error";
import { FieldMap, parseContigIds } from "./utils.ts";
import { MetadataContainer, SampleContainer } from "../Api.ts";
import { CategoryRecord } from "../../../vip-report-vcf/src/types/Metadata";

export function createConfigFilterComposed(
  id: CellId,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterComposed | null {
  let filter: ConfigFilterComposed | null;
  switch (id) {
    case "hpo":
      filter = createConfigFilterHpo(id, sample, fieldMap);
      break;
    case "locus":
      filter = createConfigFilterLocus(id, metadata);
      break;
    default:
      throw new UnexpectedEnumValueException(id);
  }
  return filter;
}

function createConfigFilterHpo(
  id: FilterId,
  sample: SampleContainer | null,
  fieldMap: FieldMap,
): ConfigFilterHpo | null {
  if (sample === null || sample.phenotypes.length === 0) return null;

  const fieldCsqHpo = fieldMap["INFO/CSQ/HPO"];
  if (fieldCsqHpo === undefined) return null;

  // overwrite categories based on the sample hpo terms
  const categories: CategoryRecord = sample.phenotypes.reduce(
    (acc, phenotype) => ({
      ...acc,
      [phenotype.type.id]: { label: phenotype.type.label },
    }),
    {},
  );

  return { type: "composed", id, field: { ...fieldCsqHpo, categories } };
}

function createConfigFilterLocus(id: FilterId, metadata: MetadataContainer): ConfigFilterLocus {
  const chromosomes = parseContigIds(metadata.records);
  return { type: "composed", id, chromosomes: chromosomes };
}
