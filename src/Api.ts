import { WindowApiClient } from "@molgenis/vip-report-api/src/WindowApiClient";
import { isSampleFather, isSampleMother } from "./utils/sample.ts";
import {
  AppMetadata,
  Cram,
  DecisionTree,
  HtsFileMetadata,
  Item,
  PagedItems,
  Params,
  PhenotypicFeature,
  Query,
  Sample,
} from "../../vip-report-api/src/Api";
import { Metadata, Record } from "../../vip-report-vcf/src/Vcf.ts";
import { createRecordSort } from "./utils/sortUtils.ts";
import { isNumerical } from "./utils/field.ts";
import { NestedFieldMetadata } from "../../vip-report-vcf/src/types/Metadata";
import { Value, ValueString } from "../../vip-report-vcf/src/ValueParser.ts";
import { compareCsq, compareCsqDefault } from "./utils/csqUtils.ts";
import { mapSvTypeToVariantTypeId, VariantTypeId } from "./utils/variantTypeUtils.ts";
import { createQuerySample } from "./utils/query.ts";
import { MockApiClient } from "./mocks/MockApiClient.ts";

/**
 * Expose aggregate metadata container for convenience
 */
export type MetadataContainer = {
  app: AppMetadata;
  htsFile: HtsFileMetadata;
  records: Metadata;
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
  ? new WindowApiClient()
  : await (function () {
      return import("./mocks/MockApiClient").then((module) => {
        return new module.MockApiClient();
      });
    })();

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
  const [appMetadata, htsFileMetadata, recordsMetadata, variantTypeIds] = await Promise.all([
    api.getAppMetadata(),
    api.getHtsFileMetadata(),
    api.getRecordsMeta(),
    fetchVariantTypeIdsQuery(),
  ]);
  return { app: appMetadata, htsFile: htsFileMetadata, records: recordsMetadata, variantTypeIds };
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
    fetchVariantTypeIdsQuery(createQuerySample(sample)),
  ]);

  return composeSample(sample, phenotypicFeatures, pedigreeSamples, variantTypeIds);
}

export async function fetchRecordById(id: number): Promise<Item<Record>> {
  console.log("Api.fetchRecordById", id);
  return api.getRecordById(id);
}

export async function fetchRecords(params: Params): Promise<PagedItems<Record>> {
  console.log("Api.fetchRecords", JSON.stringify(params));
  const [recordsMeta, records] = await Promise.all([api.getRecordsMeta(), api.getRecords(params)]);
  if (recordsMeta.info.CSQ === undefined) {
    return records;
  }

  const orders = createRecordSort(recordsMeta, params.sort).orders.filter(
    (order) =>
      order.field.parent?.id === "CSQ" &&
      isNumerical(order.field) &&
      order.field.number.type === "NUMBER" &&
      order.field.number.count === 1,
  );

  const fieldMetas = (recordsMeta.info.CSQ.nested as NestedFieldMetadata).items;
  const consequenceIndex = fieldMetas.findIndex((item) => item.id === "Consequence");
  const pickIndex = fieldMetas.findIndex((item) => item.id === "PICK");

  for (const record of records.items) {
    const csqArray = record.data.n.CSQ as Value[][] | undefined;
    if (csqArray) {
      csqArray.sort((aValue, bValue) => {
        for (const order of orders) {
          const compareValue = compareCsq(aValue, bValue, order.field, order.direction);
          if (compareValue !== 0) return compareValue;
        }
        return compareCsqDefault(aValue, bValue, pickIndex, consequenceIndex);
      });
    }
  }
  return records;
}

export async function fetchSampleProbandIds(): Promise<number[]> {
  console.log("Api.fetchSampleProbandIds");
  const query: Query = { selector: ["proband"], operator: "==", args: true };
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
    fetchVariantTypeIdsQuery(createQuerySample(sample)),
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
function composeSample(
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
        { selector: ["person", "individualId"], operator: "!=", args: sample.data.person.individualId },
        { selector: ["person", "familyId"], operator: "==", args: sample.data.person.familyId },
      ],
    },
    size: Number.MAX_SAFE_INTEGER,
  });
}

async function fetchPhenotypicFeatures(sample: Item<Sample>): Promise<PhenotypicFeature[]> {
  const phenotypes = await api.getPhenotypes({
    query: { selector: ["subject", "id"], operator: "==", args: sample.data.person.individualId },
    size: Number.MAX_SAFE_INTEGER,
  });
  return phenotypes.items.map((item) => item.data).flatMap((phenotype) => phenotype.phenotypicFeaturesList);
}

async function fetchVariantTypeIdsQuery(query?: Query): Promise<Set<VariantTypeId>> {
  const records = await api.getRecords({ query });

  const variantTypeIds = new Set<VariantTypeId>();
  records.items.forEach((record) => {
    const svType = record.data.n["SVTYPE"] as ValueString | undefined;
    const variantTypeId = mapSvTypeToVariantTypeId(svType);
    variantTypeIds.add(variantTypeId);
  });
  return variantTypeIds;
}

// development
export function isDatasetSupport(): boolean {
  return import.meta.env.PROD ? false : (api as MockApiClient).isDatasetSupport();
}

export function getDatasetIds(): string[] {
  if (import.meta.env.PROD) throw new Error("unsupported");
  return (api as MockApiClient).getDatasetIds();
}

export function selectDataset(id: string): void {
  if (import.meta.env.PROD) throw new Error(`unknown id ${id}`);
  return (api as MockApiClient).selectDataset(id);
}
