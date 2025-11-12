import { query } from "@solidjs/router";
import { DecisionTree, Item, Sample } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import {
  fetchConfig,
  fetchDecisionTree,
  fetchMetadata,
  fetchRecordById,
  fetchSampleById,
  fetchSampleTree,
  MetadataContainer,
  SampleContainer,
} from "../../utils/api.ts";
import { parseId } from "../../utils/utils.ts";
import { ConfigJson } from "../../types/config";

export const getConfig = query((): Promise<ConfigJson> => fetchConfig(), "config");

export const getMetadata = query((): Promise<MetadataContainer> => fetchMetadata(), "metadata");

export const getSampleById = query(
  (id: string | undefined): Promise<SampleContainer> => fetchSampleById(parseId(id)),
  "sample",
);

export const getRecordById = query(
  (id: string | undefined, samples?: Item<Sample>[]): Promise<Item<VcfRecord>> => fetchRecordById(parseId(id), samples),
  "variant",
);

export const getDecisionTree = query((): Promise<DecisionTree | null> => fetchDecisionTree(), "decisionTree");

export const getSampleTree = query((): Promise<DecisionTree | null> => fetchSampleTree(), "sampleTree");
