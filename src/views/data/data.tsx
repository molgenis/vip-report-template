import { cache } from "@solidjs/router";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { fetchMetadata, fetchRecordById, fetchSampleById, MetadataContainer, SampleContainer } from "../../Api";
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

export const getMetadata = cache(async (): Promise<MetadataContainer> => fetchMetadata(), "metadata");

export const getSampleById = cache(
  async (id: string | undefined): Promise<SampleContainer> => fetchSampleById(parseId(id)),
  "sample",
);

export const getRecordById = cache(
  async (id: string | undefined): Promise<Item<Record>> => fetchRecordById(parseId(id)),
  "variant",
);
