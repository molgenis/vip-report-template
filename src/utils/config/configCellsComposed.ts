import { ConfigCellCustom } from "../../types/configCells";
import {
  Genotype,
  GenotypeAllele,
  InfoMetadata,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueString,
  VcfRecord,
} from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { getSampleLabel } from "../sample.ts";
import {
  CellValueClinVar,
  CellValueConfidenceInterval,
  CellValueCustom,
  CellValueGene,
  CellValueGenotype,
  CellValueGnomAd,
  CellValueHpo,
  CellValueInheritanceModes,
  CellValueLocus,
  CellValueUserClassification,
  CellValueUserClassification,
  CellValueSpanningReads,
  CellValueVipC,
  CellValueVipCS,
  CellValueVkgl,
  CellValueStrNr,
} from "../../types/configCellComposed";
import {
  getInfoFields,
  getInfoNestedField,
  getInfoNestedFields,
  getInfoValue,
  getInfoValueCount,
  getInfoValues,
  getSampleField,
  getSampleFields,
  getSampleValue,
  getSampleValues,
  ValueCategorical,
} from "../vcf.ts";
import { VariantType } from "../variantType.ts";
import { composeSample, MetadataContainer, SampleContainer, VcfMetadataContainer } from "../api.ts";
import { href } from "../utils.ts";
import { ConfigJsonFieldComposed } from "../../types/config";
import { getDescription, getLabel } from "./config.ts";
import { ConfigInvalidError } from "../error.ts";
import { ClassificationOption } from "../../types/NotesApi";
import { ValueNumber } from "../../types/configFilter";

export function initConfigCellComposed(
  configStatic: ConfigJsonFieldComposed,
  variantType: VariantType,
  metadata: MetadataContainer,
  sample: SampleContainer | null,
  reportId: string,
  reportId: string,
): ConfigCellCustom<CellValueCustom> | null {
  const id = configStatic.name;
  let fieldConfig: ConfigCellCustom<CellValueCustom> | null;
  switch (id) {
    case "clinVar":
      fieldConfig = createConfigFieldCustomClinVar(configStatic, metadata.records);
      break;
    case "gene":
      fieldConfig = createConfigFieldCustomGene(configStatic, metadata.records);
      break;
    case "genotype":
      fieldConfig = createConfigFieldCustomGenotype(configStatic, metadata.records, sample);
      break;
    case "genotype_maternal":
      fieldConfig = createConfigFieldCustomGenotypeMaternal(configStatic, metadata.records, sample);
      break;
    case "genotype_paternal":
      fieldConfig = createConfigFieldCustomGenotypePaternal(configStatic, metadata.records, sample);
      break;
    case "gnomAdAf":
      fieldConfig = createConfigFieldCustomGnomAd(configStatic, metadata.records);
      break;
    case "hpo":
      fieldConfig = createConfigFieldCustomHpo(configStatic, metadata.records);
      break;
    case "inheritancePattern":
      fieldConfig = createConfigFieldCustomInheritancePattern(configStatic, metadata.records, sample);
      break;
    case "locus":
      fieldConfig = createConfigFieldCustomLocus(configStatic, sample, variantType);
      break;
    case "numberOfRepeatUnits":
      fieldConfig = createConfigFieldStrNr(configStatic, metadata.records, sample);
      break;
    case "notesInput":
      fieldConfig = createConfigFieldNotesInput(configStatic, metadata.records, sample, reportId);
      break;
    case "vipC":
      fieldConfig = createConfigFieldCustomVipC(configStatic, metadata.records, sample, variantType);
      break;
    case "vipCS":
      fieldConfig = createConfigFieldCustomVipCS(configStatic, metadata.records, sample);
      break;
    case "vkgl":
      fieldConfig = createConfigFieldCustomVkgl(configStatic, metadata.records);
      break;
    case "confidenceInterval":
      fieldConfig = createConfigFieldCustomConfidenceInterval(configStatic, metadata.records, sample);
      break;
    case "spanningReads":
      fieldConfig = createConfigFieldCustomSpanningReads(configStatic, metadata.records, sample);
      break;
    default:
      throw new ConfigInvalidError(`unknown composed cell name '${id}'`);
  }
  return fieldConfig;
}

function createConfigFieldCustomClinVar(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
): ConfigCellCustom<CellValueClinVar> | null {
  const [fieldClnSig, fieldClnId, fieldClnRevStat] = getInfoNestedFields(
    metadata,
    "CSQ",
    "clinVar_CLNSIG",
    "clinVar_CLNID",
    "clinVar_CLNREVSTAT",
  );
  if (fieldClnSig === undefined) return null;

  return {
    type: "composed",
    id: "clinVar",
    label: () => getLabel(config, "ClinVar"),
    description: () => getDescription(config),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldClnSig),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueClinVar => {
      const [clnSigs, clnIds, clnRevStats] = getInfoValues(
        record,
        valueIndex,
        fieldClnSig,
        fieldClnId,
        fieldClnRevStat,
      ) as [ValueCategorical[], number[] | undefined, ValueCategorical[] | undefined];

      return {
        clnSigs,
        clnIds,
        clnRevStats,
      };
    },
  };
}

function createConfigFieldCustomGene(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
): ConfigCellCustom<CellValueGene> | null {
  const [fieldSymbol, fieldGene, fieldIncPen, fieldSymbolSource] = getInfoNestedFields(
    metadata,
    "CSQ",
    "SYMBOL",
    "Gene",
    "IncompletePenetrance",
    "SYMBOL_SOURCE",
  );
  if (fieldSymbol === undefined) return null;

  return {
    type: "composed",
    id: "gene",
    label: () => getLabel(config, "Gene"),
    description: () => getDescription(config),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldSymbol),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueGene => {
      const [symbol, geneIdentifier, incompletePenetrance, symbolSource] = getInfoValues(
        record,
        valueIndex,
        fieldSymbol,
        fieldGene,
        fieldIncPen,
        fieldSymbolSource,
      ) as [ValueString, ValueString | undefined, ValueCategorical | undefined, ValueString | undefined];

      return {
        symbol,
        geneIdentifier,
        incompletePenetrance,
        symbolSource,
      };
    },
  };
}

function createConfigFieldCustomGenotype(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueGenotype> | null {
  if (sample === null) return null;
  return createConfigFieldCustomGenotypeForSample(config, metadata, sample);
}

function createConfigFieldCustomGenotypeMaternal(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueGenotype> | null {
  if (sample === null) return null;
  const maternalSample = sample.maternalSample;
  if (maternalSample === null) return null;
  return createConfigFieldCustomGenotypeForSample(config, metadata, composeSample(maternalSample));
}

function createConfigFieldCustomGenotypePaternal(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueGenotype> | null {
  if (sample === null) return null;
  const paternalSample = sample.paternalSample;
  if (paternalSample === null) return null;
  return createConfigFieldCustomGenotypeForSample(config, metadata, composeSample(paternalSample));
}

function createConfigFieldCustomGenotypeForSample(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer,
): ConfigCellCustom<CellValueGenotype> | null {
  if (sample === null) return null;

  const [fieldGt, fieldViab, fieldRu, fieldRuMatch, fieldRepCn] = getSampleFields(
    metadata,
    "GT",
    "VIAB",
    "RU_CALL",
    "RU_MATCH",
    "RU_NR",
  );
  if (fieldGt === undefined) return null; // unlikely, but possible

  const [fieldSvType, fieldDisplayRu] = getInfoFields(metadata, "SVTYPE", "DisplayRU");

  return {
    type: "composed",
    id: "genotype",
    label: () => getLabel(config, getSampleLabel(sample.item)),
    description: () => getDescription(config),
    valueCount: () => 1,
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueGenotype => {
      const [genotype, viab, repeatUnitValue, repeatUnitMatch, repeatCount] = getSampleValues(
        sample,
        record,
        valueIndex,
        fieldGt,
        fieldViab,
        fieldRu,
        fieldRuMatch,
        fieldRepCn,
      ) as [
        Genotype,
        number | null | undefined,
        ValueString | undefined,
        ValueInteger | undefined,
        ValueString[] | undefined,
      ];

      const [svType, displayRepeatUnit] = getInfoValues(record, valueIndex, fieldSvType, fieldDisplayRu) as [
        ValueString | undefined,
        ValueString | undefined,
      ];

      return {
        refAllele: record.data.r,
        altAlleles: record.data.a,
        genotype,
        repeatCount,
        svType,
        repeatUnitValue,
        repeatUnitMatch,
        displayRepeatUnit,
        viab,
      };
    },
  };
}

function createConfigFieldCustomConfidenceInterval(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueConfidenceInterval> | null {
  if (sample === null) return null;
  const fieldGt = getSampleField(metadata, "GT");
  const fieldCi = getSampleField(metadata, "RU_CI");
  return {
    type: "composed",
    id: "confidenceInterval",
    label: () => getLabel(config, "Confidence interval"),
    description: () => getDescription(config, "Confidence interval for repeat unit count"),
    valueCount: () => 1,
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueConfidenceInterval => {
      const genotype = getSampleValue(sample, record, valueIndex, fieldGt) as Genotype;
      const ci = getSampleValue(sample, record, valueIndex, fieldCi) as ValueString[];

      return {
        genotype: genotype,
        confidenceInterval: ci !== undefined ? ci : [],
      };
    },
  };
}

function createConfigFieldCustomSpanningReads(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueSpanningReads> | null {
  if (sample === null) return null;
  const fieldGt = getSampleField(metadata, "GT");
  const fieldSpan = getSampleField(metadata, "RU_SPAN");
  return {
    type: "composed",
    id: "spanningReads",
    label: () => getLabel(config, "Spanning Reads"),
    description: () => getDescription(config, "Number of spanning reads for the genotype."),
    valueCount: () => 1,
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueSpanningReads => {
      const genotype = getSampleValue(sample, record, valueIndex, fieldGt) as Genotype;
      const spanning = getSampleValue(sample, record, valueIndex, fieldSpan) as ValueInteger[];

      return {
        genotype: genotype,
        spanningReads: spanning !== undefined ? spanning : [],
      };
    },
  };
}

function createConfigFieldCustomGnomAd(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
): ConfigCellCustom<CellValueGnomAd> | null {
  const [fieldGnomAdAf, fieldGnomAdCov, fieldGnomAdQc, fieldAlleleNum] = getInfoNestedFields(
    metadata,
    "CSQ",
    "gnomAD_AF",
    "gnomAD_COV",
    "gnomAD_QC",
    "ALLELE_NUM",
  );
  if (fieldGnomAdAf == null) return null;

  return {
    type: "composed",
    id: "gnomAdAf",
    label: () => getLabel(config, "gnomAD AF"),
    description: () => getDescription(config, "gnomAD allele frequency"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldGnomAdAf),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueGnomAd => {
      const [gnomAdAf, gnomAdCov, gnomAdQcs, alleleNum] = getInfoValues(
        record,
        valueIndex,
        fieldGnomAdAf,
        fieldGnomAdCov,
        fieldGnomAdQc,
        fieldAlleleNum,
      ) as [ValueFloat, ValueFloat | undefined, string[] | undefined, number | undefined];

      return {
        c: record.data.c,
        p: record.data.p,
        r: record.data.r,
        a: record.data.a,
        gnomAdAf,
        gnomAdCov,
        gnomAdQcs,
        alleleNum,
      };
    },
  };
}

function createConfigFieldCustomHpo(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
): ConfigCellCustom<CellValueHpo> | null {
  const [fieldHpo, fieldGadoPd] = getInfoNestedFields(metadata, "CSQ", "HPO", "GADO_PD");
  if (fieldHpo == null) return null;

  return {
    type: "composed",
    id: "hpo",
    label: () => getLabel(config, "HPO"),
    description: () => getDescription(config, "Human phenotype ontology matches"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldHpo),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueHpo => {
      const [hpos, gadoPd] = getInfoValues(record, valueIndex, fieldHpo, fieldGadoPd) as [
        ValueCategorical[],
        ValueCategorical | undefined,
      ];

      return {
        hpos,
        gadoPd,
      };
    },
  };
}

function createConfigFieldCustomInheritancePattern(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueInheritanceModes> | null {
  const fieldInhModesGene = getInfoNestedField(metadata, "CSQ", "InheritanceModesGene");
  if (fieldInhModesGene == null) return null;
  const fieldVic = sample ? getSampleField(metadata, "VIC") : undefined;

  return {
    type: "composed",
    id: "inheritancePattern",
    label: () => getLabel(config, "Inh.Pat."),
    description: () => getDescription(config, "Inheritance pattern"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldInhModesGene),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueInheritanceModes => {
      const inhModesGene = getInfoValue(record, valueIndex, fieldInhModesGene) as ValueCategorical[];
      const vic = sample ? (getSampleValue(sample, record, valueIndex, fieldVic) as ValueFlag | undefined) : undefined;

      return {
        fieldInheritanceModesGene: fieldInhModesGene as InfoMetadata,
        inheritanceModesGene: inhModesGene,
        isPossibleCompound: vic,
      };
    },
  };
}

function createConfigFieldCustomLocus(
  config: ConfigJsonFieldComposed,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCellCustom<CellValueLocus> {
  const components = sample ? ["samples", sample.item.id] : [];
  return {
    type: "composed",
    id: "locus",
    label: () => getLabel(config, "Position"),
    description: () => getDescription(config),
    valueCount: () => 1,
    value: (record: Item<VcfRecord>): CellValueLocus => ({
      c: record.data.c,
      p: record.data.p,
      href: href([...components, "variants", variantType.id, "variant", record.id]),
    }),
  };
}

function createConfigFieldNotesInput(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
  reportId: string,
): ConfigCellCustom<CellValueUserClassification> {
  const [fieldHgvsC, fieldHgvsP, fieldFeature, fieldAlleleNum] = getInfoNestedFields(
    metadata,
    "CSQ",
    "HGVSc",
    "HGVSp",
    "Feature",
    "ALLELE_NUM",
  );
  const [fieldEND, fieldSvType] = getInfoFields(metadata, "END", "SVTYPE");
  const [fieldRu, fieldRuNr, fieldGt] = getSampleFields(metadata, "RU_CALL", "RU_NR", "GT");

  return {
    type: "composed",
    id: "notesInput",
    label: () => getLabel(config, "Classification"),
    description: () => getDescription(config, "User classification and notes"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldFeature),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueUserClassification => {
      const [hgvsC, hgvsP, feature, END, alleleNum, svType] = getInfoValues(
        record,
        valueIndex,
        fieldHgvsC,
        fieldHgvsP,
        fieldFeature,
        fieldEND,
        fieldAlleleNum,
        fieldSvType,
      ) as [string | undefined, string | undefined, string, number | undefined, number, string];

      const [ru, ruNr, gt] = getSampleValues(sample, record, 0, fieldRu, fieldRuNr, fieldGt) as [
        string | undefined,
        ValueNumber[],
        Genotype,
      ];

      const alleleIndex = alleleNum - 1; // VEP starts counting alternatives at 1, index 0 being the reference

      return {
        c: record.data.c,
        p: record.data.p,
        r: record.data.r,
        a: Array.isArray(record.data.a) ? record.data.a?.[alleleIndex] : record.data.a,
        s: sample,
        svType,
        hgvsC,
        hgvsP,
        feature,
        END,
        report: reportId,
        ru: ru,
        ruNr: ruNr !== undefined ? getRuNrFieldValueForAllele(gt, alleleNum, ruNr) : undefined,
        options:
          config.additionalConfig !== undefined
            ? (config.additionalConfig["classification_options"] as ClassificationOption[])
            : undefined,
      };
    },
  };
}

function createConfigFieldStrNr(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueStrNr> {
  const [fieldFeature, fieldAlleleNum] = getInfoNestedFields(metadata, "CSQ", "Feature", "ALLELE_NUM");

  const [fieldRuNr, fieldGt] = getSampleFields(metadata, "RU_NR", "GT");

  return {
    type: "composed",
    id: "numberOfRepeatUnits",
    label: () => getLabel(config, "Repeat Units"),
    description: () => getDescription(config, "Number of Repeat Units"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldFeature),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueStrNr => {
      const [alleleNum] = getInfoValues(record, valueIndex, fieldAlleleNum) as [number];

      const [ruNr, gt] = getSampleValues(sample, record, 0, fieldRuNr, fieldGt) as [ValueNumber[], Genotype];

      return {
        ruNr: ruNr !== undefined ? getRuNrFieldValueForAllele(gt, alleleNum, ruNr) : undefined,
      };
    },
  };
}

//helper to get the correct ru_nr based on combination of the CSQ alleleNr, the GT and the RuNr value
//returns -1 if the VEP value is for an allele that does not belong to the sample
function getRuNrFieldValueForAllele(genotype: Genotype, alleleNr: GenotypeAllele, ruNrs: number[]): number | undefined {
  if (alleleNr === null) {
    return undefined;
  }

  const idx = genotype.a.findIndex((allele) => allele === alleleNr);
  if (idx === -1) {
    return -1;
  }

  return Number(ruNrs[idx]);
}

function createConfigFieldCustomVipC(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCellCustom<CellValueVipC> | null {
  const [fieldVipC, fieldVipP] = getInfoNestedFields(metadata, "CSQ", "VIPC", "VIPP");
  if (fieldVipC == null) return null;

  const components = sample ? ["samples", sample.item.id] : [];

  return {
    type: "composed",
    id: "vipC",
    label: () => getLabel(config, "VIP"),
    description: () => getDescription(config, "VIP classification"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldVipC),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueVipC => {
      const [vipC, vipP] = getInfoValues(record, valueIndex, fieldVipC, fieldVipP) as [
        ValueCategorical,
        string[] | undefined,
      ];

      return {
        href: href([...components, "variants", variantType.id, "variant", record.id, "consequences", valueIndex]),
        vipC,
        vipP,
      };
    },
  };
}

function createConfigFieldCustomVipCS(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueVipCS> | null {
  if (sample === null) return null;

  const [fieldVipCS, fieldVipPS] = getSampleFields(metadata, "VIPC_S", "VIPP_S");
  if (fieldVipCS == null) return null;

  return {
    type: "composed",
    id: "vipCS",
    label: () => getLabel(config, "VIP sample"),
    description: () => getDescription(config, "VIP sample classification"),
    valueCount: (record: Item<VcfRecord>) => (getSampleValue(sample, record, 0, fieldVipCS) as string[]).length,
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueVipCS => {
      const [vipCS, vipPS] = getSampleValues(sample, record, 0, fieldVipCS, fieldVipPS) as [
        ValueCategorical[],
        string[] | undefined,
      ];
      return {
        vipCS: vipCS[valueIndex]!,
        vipPS: vipPS && vipPS.length > 0 && vipPS[valueIndex] !== undefined ? vipPS[valueIndex].split("&") : undefined,
      };
    },
  };
}

function createConfigFieldCustomVkgl(
  config: ConfigJsonFieldComposed,
  metadata: VcfMetadataContainer,
): ConfigCellCustom<CellValueVkgl> | null {
  const [
    fieldVkglCl,
    fieldVkglAmc,
    fieldVkglErasmus,
    fieldVkglLumc,
    fieldVkglNki,
    fieldVkglRadboud,
    fieldVkglUmcg,
    fieldVkglUmcu,
    fieldVkglVumc,
  ] = getInfoNestedFields(
    metadata,
    "CSQ",
    "VKGL_CL",
    "VKGL_AMC",
    "VKGL_ERASMUS",
    "VKGL_LUMC",
    "VKGL_NKI",
    "VKGL_RADBOUD_MUMC",
    "VKGL_UMCG",
    "VKGL_UMCU",
    "VKGL_VUMC",
  );
  if (fieldVkglCl == null) return null;

  return {
    type: "composed",
    id: "vkgl",
    label: () => getLabel(config, "VKGL"),
    description: () => getDescription(config, "VKGL consensus classification"),
    valueCount: (record: Item<VcfRecord>) => getInfoValueCount(record, fieldVkglCl),
    value: (record: Item<VcfRecord>, valueIndex: number): CellValueVkgl => {
      const [vkglCl, vkglAmc, vkglErasmus, vkglLumc, vkglNki, vkglRadboudMumc, vkglUmcg, vkglUmcu, vkglVumc] =
        getInfoValues(
          record,
          valueIndex,
          fieldVkglCl,
          fieldVkglAmc,
          fieldVkglErasmus,
          fieldVkglLumc,
          fieldVkglNki,
          fieldVkglRadboud,
          fieldVkglUmcg,
          fieldVkglUmcu,
          fieldVkglVumc,
        ) as [
          ValueCategorical,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
          ValueCategorical | undefined,
        ];

      return {
        vkglCl,
        vkglAmc,
        vkglErasmus,
        vkglLumc,
        vkglNki,
        vkglRadboudMumc,
        vkglUmcg,
        vkglUmcu,
        vkglVumc,
      };
    },
  };
}
