import { FilterId } from "../types/configFilter";
import { ConfigFilterComposed, ConfigFilterLocus } from "../types/configFilterComposed";
import { CellId } from "../types/configCell";
import { UnexpectedEnumValueException } from "./error";
import { parseContigIds } from "./utils.ts";
import { MetadataContainer } from "../Api.ts";

export function createConfigFilterComposed(id: CellId, metadata: MetadataContainer): ConfigFilterComposed {
  let filter: ConfigFilterComposed;
  switch (id) {
    case "locus":
      filter = createConfigFilterLocus(id, metadata);
      break;
    default:
      throw new UnexpectedEnumValueException(id);
  }
  return filter;
}

function createConfigFilterLocus(id: FilterId, metadata: MetadataContainer): ConfigFilterLocus {
  const chromosomes = parseContigIds(metadata.records);
  return { type: "composed", id, chromosomes: chromosomes };
}
