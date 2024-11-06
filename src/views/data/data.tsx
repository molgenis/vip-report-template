import { query } from "@solidjs/router";
import { Item, Json } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import {
  fetchConfig,
  fetchMetadata,
  fetchRecordById,
  fetchSampleById,
  MetadataContainer,
  SampleContainer,
} from "../../Api";
import { parseId } from "../../utils/utils.ts";
import { ConfigStatic } from "../../types/config";

export const getConfig = query(
  (key: string): Promise<Json | null> =>
    fetchConfig().then((config) => (config ? (config[key as keyof ConfigStatic] as unknown as Json) : null)),
  "config",
);

export const getMetadata = query((): Promise<MetadataContainer> => fetchMetadata(), "metadata");

export const getSampleById = query(
  (id: string | undefined): Promise<SampleContainer> => fetchSampleById(parseId(id)),
  "sample",
);

export const getRecordById = query(
  (id: string | undefined): Promise<Item<VcfRecord>> => fetchRecordById(parseId(id)),
  "variant",
);
