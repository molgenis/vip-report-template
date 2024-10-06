import { FilterId } from "../types/filter";
import { MetadataContainer, parseContigIds } from "./ApiUtils";
import { ConfigFilterCustom, ConfigFilterCustomLocus } from "../types/filterCustom";

export function createConfigFilterCustom(id: FilterId, metadata: MetadataContainer): ConfigFilterCustom {
  let filter: ConfigFilterCustom;
  switch (id) {
    case "custom/locus":
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
