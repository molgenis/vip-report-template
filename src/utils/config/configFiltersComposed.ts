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
import { ConfigJsonFilterComposed, ConfigVip } from "../../types/config";
import { getDescription, getLabel } from "./config.ts";
import { getInfoNestedField, getSampleField, getSampleFields, parseContigIds } from "../vcf.ts";
import { ConfigInvalidError } from "../error.ts";

export function initConfigFilterComposed(
  config: ConfigJsonFilterComposed,
  configVip: ConfigVip,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterComposed | null {
  const id = config.name;

  let filter: ConfigFilterComposed | null;
  switch (id) {
    case "allelicImbalance":
      filter = createConfigFilterAllelicImbalance(config, metadata.records, sample);
      break;
    case "deNovo":
      filter = createConfigFilterDeNovo(config, metadata.records, sample);
      break;
    case "hpo":
      filter = createConfigFilterHpo(config, metadata.records, sample);
      break;
    case "inheritanceMatch":
      filter = createConfigFilterInheritanceMatch(config, metadata.records, sample);
      break;
    case "locus":
      filter = createConfigFilterLocus(config, metadata);
      break;
    case "vipC":
      filter = createConfigFilterVipC(config, configVip, metadata.records);
      break;
    case "vipCS":
      filter = createConfigFilterVipCS(config, configVip, metadata.records, sample);
      break;
    default:
      throw new ConfigInvalidError(`unknown composed filter name '${id}'`);
  }
  return filter;
}

function createConfigFilterHpo(
  configStatic: ConfigJsonFilterComposed,
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
    defaultValue: configStatic.defaultValue,
  };
}

function createConfigFilterLocus(
  configStatic: ConfigJsonFilterComposed,
  metadata: MetadataContainer,
): ConfigFilterLocus {
  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, "Locus"),
    description: () => getDescription(configStatic),
    chromosomes: parseContigIds(metadata.records),
    defaultValue: configStatic.defaultValue,
  };
}

function createConfigFilterAllelicImbalance(
  configStatic: ConfigJsonFilterComposed,
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
    defaultValue: configStatic.defaultValue,
    sample: sample,
  };
}

function createConfigFilterInheritanceMatch(
  configStatic: ConfigJsonFilterComposed,
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
    defaultValue: configStatic.defaultValue,
    sample: sample,
  };
}

function createConfigFilterDeNovo(
  configStatic: ConfigJsonFilterComposed,
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
    defaultValue: configStatic.defaultValue,
    sample: sample,
  };
}

function createConfigFilterVipC(
  configStatic: ConfigJsonFilterComposed,
  configVip: ConfigVip,
  metadata: VcfMetadataContainer,
): ConfigFilterVipC | null {
  if (!configVip.params.vcf.filter.consequences) return null;

  const vipCField = getInfoNestedField(metadata, "CSQ", "VIPC");
  if (vipCField === undefined) return null;

  const categories = vipCField.categories;
  if (categories === undefined) return null;

  // exclude categories that were removed after filtering
  const classSet = new Set(configVip.params.vcf.filter.classes.split(","));
  const treeCategories = Object.fromEntries(Object.entries(categories).filter(([key]) => classSet.has(key)));
  if (Object.keys(treeCategories).length <= 1) return null;

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, vipCField.label || "VIPC"),
    description: () => getDescription(configStatic, vipCField.description),
    field: { ...vipCField, categories: treeCategories },
    defaultValue: configStatic.defaultValue,
  };
}

function createConfigFilterVipCS(
  configStatic: ConfigJsonFilterComposed,
  configVip: ConfigVip,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigFilterVipCS | null {
  if (sample === null || !sample.item.data.proband) return null;
  const vipCSField = getSampleField(metadata, "VIPC_S");
  if (vipCSField === undefined) return null;

  const categories = vipCSField.categories;
  if (categories === undefined) return null;

  // exclude categories that were removed after filtering
  const classSet = new Set(configVip.params.vcf.filter_samples.classes.split(","));
  const treeCategories = Object.fromEntries(Object.entries(categories).filter(([key]) => classSet.has(key)));
  if (Object.keys(treeCategories).length <= 1) return null;

  return {
    type: "composed",
    id: configStatic.name,
    label: () => getLabel(configStatic, vipCSField.label || "VIPC_S"),
    description: () => getDescription(configStatic, vipCSField.description),
    field: { ...vipCSField, categories: treeCategories, required: true },
    defaultValue: configStatic.defaultValue,
    sample,
  };
}
