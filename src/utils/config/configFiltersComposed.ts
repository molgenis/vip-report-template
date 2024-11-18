import {
  ConfigFilterAllelicImbalance,
  ConfigFilterComposed,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  ConfigFilterLocus,
  ConfigFilterVipC,
  ConfigFilterVipCS,
} from "../../types/configFilterComposed";
import { MetadataContainer, SampleContainer, VcfMetadataContainer } from "../api.ts";
import { ConfigStaticFieldComposed, ConfigVip } from "../../types/config";
import { getDescription, getLabel } from "./config.ts";
import { getInfoNestedField, getSampleField, getSampleFields, parseContigIds } from "../vcf.ts";
import { ConfigInvalidError } from "../error.ts";

export function initConfigFilterComposed(
  configStatic: ConfigStaticFieldComposed,
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterComposed | null {
  const id = configStatic.name;

  let filter: ConfigFilterComposed | null;
  switch (id) {
    case "hpo":
      filter = createConfigFilterHpo(configStatic, metadata.records, sample);
      break;
    case "locus":
      filter = createConfigFilterLocus(configStatic, metadata);
      break;
    case "allelicImbalance":
      filter = createConfigFilterAllelicImbalance(configStatic, metadata.records, sample);
      break;
    case "inheritanceMatch":
      filter = createConfigFilterInheritanceMatch(configStatic, metadata.records, sample);
      break;
    case "deNovo":
      filter = createConfigFilterDeNovo(configStatic, metadata.records, sample);
      break;
    case "vipC":
      filter = createConfigFilterVipC(configStatic, configVip, metadata.records);
      break;
    case "vipCS":
      filter = createConfigFilterVipCS(configStatic, configVip, metadata.records, sample);
      break;
    default:
      throw new ConfigInvalidError(`unknown composed filter name '${id}'`);
  }
  return filter;
}

function createConfigFilterHpo(
  configStatic: ConfigStaticFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterHpo | null {
  if (sample === null || sample.phenotypes.length === 0) return null;
  const fieldCsqHpo = getInfoNestedField(metadata, "CSQ", "HPO");
  if (fieldCsqHpo === undefined) return null;

  const filterField = {
    // create field with categories based on the sample hpo terms
    ...fieldCsqHpo,
    categories: sample.phenotypes.reduce(
      (acc, phenotype) => ({
        ...acc,
        [phenotype.type.id]: { label: phenotype.type.label },
      }),
      {},
    ),
  };

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, fieldCsqHpo.label || "HPO"),
    description: () => getDescription(configStatic, filterField.description),
    field: filterField,
  };
}

function createConfigFilterLocus(
  configStatic: ConfigStaticFieldComposed,
  metadata: MetadataContainer,
): ConfigFilterLocus {
  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, "Locus"),
    description: () => getDescription(configStatic),
    chromosomes: parseContigIds(metadata.records),
  };
}

function createConfigFilterAllelicImbalance(
  configStatic: ConfigStaticFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterAllelicImbalance | null {
  if (sample === null) return null;
  const [fieldViab, fieldGenotype] = getSampleFields(metadata, "VIAB", "GT");
  if (fieldViab === undefined || fieldGenotype === undefined) return null;

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, fieldViab.label || "VIAB"),
    description: () => getDescription(configStatic, fieldViab.description),
    genotypeField: fieldGenotype,
    viabField: fieldViab,
    sample: sample,
  };
}

function createConfigFilterInheritanceMatch(
  configStatic: ConfigStaticFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterInheritanceMatch | null {
  if (sample === null) return null;
  const vimField = getSampleField(metadata, "VIM");
  if (vimField === undefined) return null;

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, vimField.label || "VIM"),
    description: () => getDescription(configStatic, vimField.description),
    vimField: { ...vimField, required: true },
    sample: sample,
  };
}

function createConfigFilterDeNovo(
  configStatic: ConfigStaticFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterDeNovo | null {
  if (sample === null) return null;
  const vidField = getSampleField(metadata, "VID");
  if (vidField === undefined) return null;

  return {
    type: "composed",
    id: configStatic.name,
    label: () => configStatic.label || vidField.label || "VID",
    description: () => configStatic.description || vidField.description || null,
    vidField: { ...vidField, required: true },
    sample: sample,
  };
}

function createConfigFilterVipC(
  configStatic: ConfigStaticFieldComposed,
  configVip: ConfigVip,
  metadata: VcfMetadataContainer,
): ConfigFilterVipC | null {
  const vipCField = getInfoNestedField(metadata, "CSQ", "VIPC");
  if (vipCField === undefined) return null;

  const categories = vipCField.categories;
  if (categories === undefined) return null;

  // exclude categories that were removed after filtering
  const classSet = new Set(configVip.params.vcf.filter.classes.split(","));
  const treeCategories = Object.fromEntries(Object.entries(categories).filter(([key]) => classSet.has(key)));

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, vipCField.label || "VIPC"),
    description: () => getDescription(configStatic, vipCField.description),
    field: { ...vipCField, categories: treeCategories },
  };
}

function createConfigFilterVipCS(
  configStatic: ConfigStaticFieldComposed,
  configVip: ConfigVip,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterVipCS | null {
  if (sample === null) return null;
  const vipCSField = getSampleField(metadata, "VIPC_S");
  if (vipCSField === undefined) return null;

  const categories = vipCSField.categories;
  if (categories === undefined) return null;

  // exclude categories that were removed after filtering
  const classSet = new Set(configVip.params.vcf.filter_samples.classes.split(","));
  const treeCategories = Object.fromEntries(Object.entries(categories).filter(([key]) => classSet.has(key)));

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, vipCSField.label || "VIPC_S"),
    description: () => getDescription(configStatic, vipCSField.description),
    field: { ...vipCSField, categories: treeCategories },
    sample,
  };
}
