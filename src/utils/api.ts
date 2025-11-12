import {
  AppMetadata,
  Cram,
  DecisionTree,
  Item,
  PagedItems,
  Params,
  PhenotypicFeature,
  Query,
  RecordParams,
  Sample,
} from "@molgenis/vip-report-api";
import { isSampleFather, isSampleMother } from "./sample.ts";
import { InfoOrder, VcfMetadata, VcfRecord } from "@molgenis/vip-report-vcf";
import { createFieldMap, FieldMap } from "./vcf.ts";
import { VariantTypeId } from "./variantType.ts";
import { MockApiClient } from "../mocks/MockApiClient.ts";
import { ConfigJson } from "../types/config";
import { RuntimeError } from "./error.ts";
import { validateConfig } from "./config/configValidator.ts";
import { WindowApiClientFactory } from "@molgenis/vip-report-api";

export type VcfMetadataContainer = VcfMetadata & {
  fieldMap: FieldMap;
};
/**
 * Expose aggregate metadata container for convenience
 */
export type MetadataContainer = {
  app: AppMetadata;
  records: VcfMetadataContainer;
  variantTypeIds: Set<VariantTypeId>;
};

/**
 * Expose aggregate sample container for convenience
 */
export type SampleContainer = {
  item: Item<Sample>;
  paternalSample: Item<Sample> | null;
  maternalSample: Item<Sample> | null;
  phenotypes: PhenotypicFeature[];
  otherPedigreeSamples: Item<Sample>[];
  variantTypeIds: Set<VariantTypeId>;
};

// lazy import MockApiClient to ensure that it is excluded from the build artifact
const api = import.meta.env.PROD
  ? await (async () => await WindowApiClientFactory.create())()
  : await (async () => {
      const module = await import("../mocks/MockApiClient.ts");
      return new module.MockApiClient();
    })();

export async function fetchConfig(): Promise<ConfigJson> {
  console.log("Api.fetchConfig");
  const config = await api.getConfig();
  if (config === null) throw new RuntimeError("no config provided");
  return validateConfig(config);
}

export async function fetchDecisionTree(): Promise<DecisionTree | null> {
  console.log("Api.fetchDecisionTree");
  return await api.getDecisionTree();
}

export async function fetchSampleTree(): Promise<DecisionTree | null> {
  console.log("Api.fetchSampleTree");
  return await api.getSampleTree();
}

export async function fetchSamples(params: Params): Promise<PagedItems<SampleContainer>> {
  console.log("Api.fetchSamples", JSON.stringify(params));
  const samplePagedItems = await api.getSamples(params);
  const samples = await Promise.all(samplePagedItems.items.map((sample) => fetchSampleContainer(sample)));
  return {
    page: samplePagedItems.page,
    total: samplePagedItems.total,
    items: samples.map((sample) => ({ id: sample.item.id, data: sample })),
  };
}

/**
 * Fetch metadata composed of app metadata, high throughput sequencing file metadata and records metadata
 */
export async function fetchMetadata(): Promise<MetadataContainer> {
  console.log("Api.fetchMetadata");
  const [appMetadata, recordsMetadata, variantTypeIds] = await Promise.all([
    api.getAppMetadata(),
    api.getRecordsMeta(),
    fetchVariantTypeIdsQuery(),
  ]);

  // precompute field map
  const fieldMap = createFieldMap(recordsMetadata);

  return { app: appMetadata, records: { ...recordsMetadata, fieldMap }, variantTypeIds };
}

/**
 * Fetch sample composed of sample, pedigree samples and phenotypic features
 */
export async function fetchSampleById(sampleId: number): Promise<SampleContainer> {
  console.log("Api.fetchSampleById", sampleId);
  const sample = await api.getSampleById(sampleId);

  const [pedigreeSamples, phenotypicFeatures, variantTypeIds] = await Promise.all([
    fetchPedigreeSamples(sample),
    fetchPhenotypicFeatures(sample),
    fetchVariantTypeIdsQuery(),
  ]);

  return composeSample(sample, phenotypicFeatures, pedigreeSamples, variantTypeIds);
}

export async function fetchRecordById(id: number, samples?: Item<Sample>[]): Promise<Item<VcfRecord>> {
  console.log("Api.fetchRecordById", id);
  const sampleIds = samples?.map((sample) => sample.id) ?? [];
  return api.getRecordById(id, sampleIds);
}

export async function fetchRecords(params: RecordParams): Promise<PagedItems<VcfRecord>> {
  console.log("Api.fetchRecords", JSON.stringify(params));
  return api.getRecords(params);
}

export async function fetchInfoOrder(): Promise<InfoOrder> {
  console.log("Api.fetchInfoOrder");
  return api.getInfoOrder();
}

export async function fetchSampleProbandIds(): Promise<number[]> {
  console.log("Api.fetchSampleProbandIds");
  const query: Query = { selector: ["sample", "proband"], operator: "==", args: true };
  const samplePagedItems = await api.getSamples({ query, page: 0, size: Number.MAX_SAFE_INTEGER });
  return samplePagedItems.items.map((sampleItem) => sampleItem.id);
}

export async function fetchFastaGz(contig: string, pos: number): Promise<Uint8Array | null> {
  console.log("Api.fetchFastaGz", contig, pos);
  return api.getFastaGz(contig, pos);
}

export async function fetchGenesGz(): Promise<Uint8Array | null> {
  console.log("Api.fetchGenesGz");
  return api.getGenesGz();
}

export async function fetchCram(sampleId: string): Promise<Cram | null> {
  console.log("Api.fetchCram", sampleId);
  return api.getCram(sampleId);
}

async function fetchSampleContainer(sample: Item<Sample>): Promise<SampleContainer> {
  const [pedigreeSamples, phenotypicFeatures, variantTypeIds] = await Promise.all([
    fetchPedigreeSamples(sample),
    fetchPhenotypicFeatures(sample),
    fetchVariantTypeIdsQuery(),
  ]);

  return composeSample(sample, phenotypicFeatures, pedigreeSamples, variantTypeIds);
}

/**
 * Compose sample from API sample, API sample phenotypes and API pedigree samples data
 *
 * @param sample API sample
 * @param samplePhenotypes API sample phenotypes
 * @param pedigreeSamples API samples from same pedigree
 * @param variantTypeIds variant types available for this sample
 */
export function composeSample(
  sample: Item<Sample>,
  samplePhenotypes?: PhenotypicFeature[],
  pedigreeSamples?: PagedItems<Sample>,
  variantTypeIds?: Set<VariantTypeId>,
): SampleContainer {
  let paternalSample: Item<Sample> | null = null;
  let maternalSample: Item<Sample> | null = null;
  const otherPedigreeSamples: Item<Sample>[] = [];

  pedigreeSamples?.items.forEach((pedigreeSample) => {
    if (isSampleFather(sample.data, pedigreeSample.data)) {
      paternalSample = pedigreeSample;
    } else if (isSampleMother(sample.data, pedigreeSample.data)) {
      maternalSample = pedigreeSample;
    } else {
      otherPedigreeSamples.push(pedigreeSample);
    }
  });

  return {
    item: sample,
    paternalSample,
    maternalSample,
    phenotypes: samplePhenotypes || [],
    otherPedigreeSamples,
    variantTypeIds: variantTypeIds || new Set<VariantTypeId>(),
  };
}

async function fetchPedigreeSamples(sample: Item<Sample>): Promise<PagedItems<Sample>> {
  return await api.getSamples({
    query: {
      operator: "and",
      args: [
        { selector: ["sample", "individualId"], operator: "!=", args: sample.data.person.individualId },
        { selector: ["sample", "familyId"], operator: "==", args: sample.data.person.familyId },
      ],
    },
    size: Number.MAX_SAFE_INTEGER,
  });
}

async function fetchPhenotypicFeatures(sample: Item<Sample>): Promise<PhenotypicFeature[]> {
  const phenotypes = await api.getPhenotypes({
    query: { selector: ["sample", "individualId"], operator: "==", args: sample.data.person.individualId },
    size: Number.MAX_SAFE_INTEGER,
  });
  return phenotypes.items.map((item) => item.data).flatMap((phenotype) => phenotype.phenotypicFeaturesList);
}

async function fetchVariantTypeIdsQuery(): Promise<Set<VariantTypeId>> {
  const config: ConfigJson = await fetchConfig();

  const variantTypeIds = new Set<VariantTypeId>();
  const params = config.vip.params.cram;
  if (params) {
    if (params.call_snv) variantTypeIds.add("snv");
    if (params.call_str) variantTypeIds.add("str");
    if (params.call_sv || params.call_cnv) variantTypeIds.add("sv");
  } else {
    variantTypeIds.add("snv");
    variantTypeIds.add("str");
    variantTypeIds.add("sv");
  }
  return variantTypeIds;
}

// development
export function isDatasetSupport(): boolean {
  return !import.meta.env.PROD;
}

export function getDatasetIds(): string[] {
  if (import.meta.env.PROD) throw new Error("unsupported");
  return (api as MockApiClient).getDatasetIds();
}

export function selectDataset(id: string): void {
  if (import.meta.env.PROD) throw new Error(`unknown id ${id}`);
  (api as MockApiClient).selectDataset(id);
}
