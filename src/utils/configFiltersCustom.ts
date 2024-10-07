import { FilterId } from "../types/configFilter";
import { MetadataContainer, parseContigIds } from "./ApiUtils";
import { ConfigFilterCustom, ConfigFilterCustomLocus } from "../types/configFilterCustom";
import { FieldId } from "../types/configField";

export function createConfigFilterCustom(id: FieldId, metadata: MetadataContainer): ConfigFilterCustom {
  let filter: ConfigFilterCustom;
  switch (id) {
    case "locus":
      filter = createConfigFilterCustomLocus(id, metadata);
      break;
    default:
      throw new Error(`unexpected custom filter id '${id}'`);
  }
  return filter;
}

function createConfigFilterCustomLocus(id: FilterId, metadata: MetadataContainer): ConfigFilterCustomLocus {
  const chromosomes = parseContigIds(metadata.records);
  return { type: "custom", id, chromosomes: chromosomes };
}
