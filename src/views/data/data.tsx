import { cache } from "@solidjs/router";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../../Api";
import { InvalidIdException } from "../../utils/error";

/**
 * Parse non-negative integer id
 */
function parseId(id: string | undefined): number {
  const number = Number(id);
  if (!(Number.isInteger(number) && number >= 0)) {
    throw new InvalidIdException(id);
  }
  return number;
}

export const getSample = cache(
  async (id: string | undefined): Promise<Item<Sample>> => api.getSampleById(parseId(id)),
  "sample",
);

export const getVariant = cache(
  async (id: string | undefined): Promise<Item<Record>> => api.getRecordById(parseId(id)),
  "variant",
);
