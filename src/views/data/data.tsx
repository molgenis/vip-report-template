import { query } from "@solidjs/router";
import { Item } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import {
  fetchConfig,
  fetchMetadata,
  fetchRecordById,
  fetchSampleById,
  MetadataContainer,
  SampleContainer,
} from "../../utils/api.ts";
import { parseId } from "../../utils/utils.ts";
import { ConfigStatic } from "../../types/config";

export const getConfig = query((): Promise<ConfigStatic> => fetchConfig(), "config");

export const getMetadata = query((): Promise<MetadataContainer> => fetchMetadata(), "metadata");

export const getSampleById = query(
  (id: string | undefined): Promise<SampleContainer> => fetchSampleById(parseId(id)),
  "sample",
);

export const getRecordById = query(
  (id: string | undefined): Promise<Item<VcfRecord>> => fetchRecordById(parseId(id)),
  "variant",
);
