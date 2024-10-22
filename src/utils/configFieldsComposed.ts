import { CellId, ConfigCellCustom, RecordContext } from "../types/configCell";
import { Genotype, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { getSampleLabel } from "./sample";
import {
  CellValueClinVar,
  CellValueCustom,
  CellValueGene,
  CellValueGenotype,
  CellValueGnomAd,
  CellValueHpo,
  CellValueInheritanceModes,
  CellValueLocus,
  CellValueRef,
  CellValueVipC,
  CellValueVkgl,
} from "../types/configCellComposed";
import { ValueFlag, ValueFloat, ValueString } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getFieldMultilineValue, getFieldValueCount, getNestedFieldIndices } from "./csqUtils";
import { getCategoryLabelAndDescription } from "./field";
import { InfoMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { UnexpectedEnumValueException } from "./error";
import { VariantType } from "./variantTypeUtils";
import { SampleContainer } from "../Api.ts";
import { FieldMap, getRecordSample, href } from "./utils.ts";

export function createConfigFieldComposed(
  id: CellId,
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCellCustom<CellValueCustom> | null {
  let fieldConfig: ConfigCellCustom<CellValueCustom> | null;
  switch (id) {
    case "clinVar":
      fieldConfig = createConfigFieldCustomClinVar(fieldMap);
      break;
    case "gene":
      fieldConfig = createConfigFieldCustomGene(fieldMap);
      break;
    case "genotype":
      fieldConfig = createConfigFieldCustomGenotype(sample);
      break;
    case "gnomAdAf":
      fieldConfig = createConfigFieldCustomGnomAd(fieldMap);
      break;
    case "hpo":
      fieldConfig = createConfigFieldCustomHpo(fieldMap);
      break;
    case "inheritancePattern":
      fieldConfig = createConfigFieldCustomInheritancePattern(fieldMap, sample);
      break;
    case "locus":
      fieldConfig = createConfigFieldCustomLocus(sample, variantType);
      break;
    case "ref":
      fieldConfig = createConfigFieldCustomRef();
      break;
    case "vipC":
      fieldConfig = createConfigFieldCustomVipC(fieldMap, sample, variantType);
      break;
    case "vkgl":
      fieldConfig = createConfigFieldCustomVkgl(fieldMap);
      break;
    default:
      throw new UnexpectedEnumValueException(id);
  }
  return fieldConfig;
}

function createConfigFieldCustomClinVar(fieldMap: FieldMap): ConfigCellCustom<CellValueClinVar> | null {
  const fieldCsq = fieldMap["INFO/CSQ"];
  if (fieldCsq === undefined) return null;

  const [fieldIndexClnId, fieldIndexClnRevStat, fieldIndexClnSig] = getNestedFieldIndices(fieldCsq, [
    "clinVar_CLNID",
    "clinVar_CLNREVSTAT",
    "clinVar_CLNSIG",
  ]) as [number, number, number];
  if (fieldIndexClnSig == -1) return null;

  const fieldCsqClnSig = fieldMap["INFO/CSQ/clinVar_CLNSIG"];
  if (fieldCsqClnSig === undefined) return null;

  return {
    type: "composed",
    id: "clinVar",
    label: "ClinVar",
    valueCount: (record: Item<Record>) => getFieldValueCount(fieldCsq, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueClinVar => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error("missing required value index");

      const csqFieldValue = getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexClnSig) as
        | string[]
        | undefined;
      const clnSigs = csqFieldValue
        ? csqFieldValue.map((value) => getCategoryLabelAndDescription(value, fieldCsqClnSig))
        : [];

      return {
        clnIds:
          fieldIndexClnId !== -1
            ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexClnId) as number[])
            : undefined,
        clnRevStats:
          fieldIndexClnRevStat !== -1
            ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexClnRevStat) as string[])
            : undefined,
        clnSigs,
      };
    },
  };
}

function createConfigFieldCustomGene(fieldMap: FieldMap): ConfigCellCustom<CellValueGene> | null {
  const fieldCsq = fieldMap["INFO/CSQ"];
  if (fieldCsq === undefined) return null;

  const [fieldIndexGene, fieldIndexIncompletePenetrance, fieldIndexSymbol, fieldIndexSymbolSource] =
    getNestedFieldIndices(fieldCsq, ["Gene", "IncompletePenetrance", "SYMBOL", "SYMBOL_SOURCE"]) as [
      number,
      number,
      number,
      number,
    ];
  if (fieldIndexSymbol == -1) return null;

  return {
    type: "composed",
    id: "gene",
    label: "Gene",
    valueCount: (record: Item<Record>) => getFieldValueCount(fieldCsq, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueGene => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();

      return {
        geneIdentifier: fieldIndexGene
          ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexGene) as ValueString)
          : undefined,
        incompletePenetrance: fieldIndexIncompletePenetrance
          ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexIncompletePenetrance) as ValueFlag)
          : undefined,
        symbol: getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexSymbol) as ValueString,
        symbolSource: fieldIndexSymbolSource
          ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexSymbolSource) as ValueString)
          : undefined,
      };
    },
  };
}

function createConfigFieldCustomGenotype(sample: SampleContainer | null): ConfigCellCustom<CellValueGenotype> | null {
  if (sample === null) return null;

  return {
    type: "composed",
    id: "genotype",
    label: getSampleLabel(sample.item),
    valueCount: () => 1,
    value: (record: Item<Record>): CellValueGenotype => {
      const recordSample = getRecordSample(record, sample);
      return {
        refAllele: record.data.r,
        altAlleles: record.data.a,
        repeatCount: recordSample["REPCN"] as ValueString, // FIXME some fields may be undefined
        svType: record.data.n["SVTYPE"] as ValueString,
        repeatUnitValue: record.data.n["RU"] as ValueString,
        repeatUnitMatch: record.data.n["RUMATCH"] as ValueFlag,
        displayRepeatUnit: record.data.n["DisplayRU"] as ValueString,
        genotype: recordSample["GT"] as Genotype,
        viab: recordSample["VIAB"] as number | undefined | null,
      };
    },
  };
}

function createConfigFieldCustomGnomAd(fieldMap: FieldMap): ConfigCellCustom<CellValueGnomAd> | null {
  const fieldCsq = fieldMap["INFO/CSQ"];
  if (fieldCsq === undefined) return null;

  const [fieldIndexAlleleNum, fieldIndexGnomAdAf, fieldIndexGnomAdCov, fieldIndexGnomAdQc] = getNestedFieldIndices(
    fieldCsq,
    ["ALLELE_NUM", "gnomAD_AF", "gnomAD_COV", "gnomAD_QC"],
  ) as [number, number, number, number];
  if (fieldIndexAlleleNum === -1 || fieldIndexGnomAdAf == -1) {
    return null;
  }

  return {
    type: "composed",
    id: "gnomAdAf",
    label: "gnomAD AF",
    description: "gnomAD allele frequency",
    valueCount: (record: Item<Record>) => getFieldValueCount(fieldCsq, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueGnomAd => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();

      return {
        c: record.data.c,
        p: record.data.p,
        r: record.data.r,
        a: record.data.a,
        alleleNum: getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexAlleleNum) as number,
        gnomAdAf: getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexGnomAdAf) as ValueFloat,
        gnomAdCov:
          fieldIndexGnomAdCov !== -1
            ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexGnomAdCov) as ValueFloat)
            : undefined,
        gnomAdQcs:
          fieldIndexGnomAdQc !== -1
            ? (getFieldMultilineValue(fieldCsq, record, valueIndex, fieldIndexGnomAdQc) as string[])
            : undefined,
      };
    },
  };
}

function createConfigFieldCustomHpo(fieldMap: FieldMap): ConfigCellCustom<CellValueHpo> | null {
  const csqField = fieldMap["INFO/CSQ"];
  if (csqField === undefined) {
    return null;
  }

  const [fieldIndexGadoPd, fieldIndexHpo] = getNestedFieldIndices(csqField, ["GADO_PD", "HPO"]) as [number, number];
  if (fieldIndexHpo === -1) {
    return null;
  }

  return {
    type: "composed",
    id: "hpo",
    label: "HPO",
    description: "Human phenotype ontology matches",
    valueCount: (record: Item<Record>) => getFieldValueCount(csqField, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueHpo => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();

      return {
        gadoPd:
          fieldIndexGadoPd !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexGadoPd) as ValueString)
            : undefined,
        hpos: getFieldMultilineValue(csqField, record, valueIndex, fieldIndexHpo) as string[],
      };
    },
  };
}

function createConfigFieldCustomInheritancePattern(
  fieldMap: FieldMap,
  sample: SampleContainer | null,
): ConfigCellCustom<CellValueInheritanceModes> | null {
  if (sample === null) return null;

  const csqField = fieldMap["INFO/CSQ"];
  if (csqField === undefined) {
    return null;
  }

  const [fieldIndexInheritanceModesGene] = getNestedFieldIndices(csqField, ["InheritanceModesGene"]) as [number];
  if (fieldIndexInheritanceModesGene === -1) {
    return null;
  }

  const fieldInheritanceModesGene = fieldMap["INFO/CSQ/InheritanceModesGene"];
  if (fieldInheritanceModesGene === undefined) {
    return null;
  }

  return {
    type: "composed",
    id: "inheritancePattern",
    label: "Inh.Pat.",
    description: "Inheritance pattern",
    valueCount: (record: Item<Record>) => getFieldValueCount(csqField, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueInheritanceModes => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();
      const sampleVic = getRecordSample(record, sample)["VIC"];

      return {
        fieldInheritanceModesGene: fieldInheritanceModesGene as InfoMetadata,
        inheritanceModesGene: getFieldMultilineValue(
          csqField,
          record,
          valueIndex,
          fieldIndexInheritanceModesGene,
        ) as string[],
        isPossibleCompound: sampleVic !== undefined && sampleVic != null,
      };
    },
  };
}

function createConfigFieldCustomLocus(
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCellCustom<CellValueLocus> {
  const components = sample ? ["samples", sample.item.id] : [];
  return {
    type: "composed",
    id: "locus",
    label: "Position",
    valueCount: () => 1,
    value: (record: Item<Record>): CellValueLocus => ({
      c: record.data.c,
      p: record.data.p,
      href: href([...components, "variants", variantType.id, "variant", record.id]),
    }),
  };
}

function createConfigFieldCustomRef(): ConfigCellCustom<CellValueRef> {
  return {
    type: "composed",
    id: "ref",
    label: "Reference",
    valueCount: () => 1,
    value: (record: Item<Record>): CellValueRef => ({
      ref: record.data.r,
    }),
  };
}

function createConfigFieldCustomVipC(
  fieldMap: FieldMap,
  sample: SampleContainer | null,
  variantType: VariantType,
): ConfigCellCustom<CellValueVipC> | null {
  const csqField = fieldMap["INFO/CSQ"];
  if (csqField === undefined) {
    return null;
  }

  const [fieldIndexVipC, fieldIndexVipP] = getNestedFieldIndices(csqField, ["VIPC", "VIPP"]) as [number, number];
  if (fieldIndexVipC === -1) {
    return null;
  }

  const components = sample ? ["samples", sample.item.id] : [];

  return {
    type: "composed",
    id: "vipC",
    label: "VIP",
    description: "VIP classification",
    valueCount: (record: Item<Record>) => getFieldValueCount(csqField, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueVipC => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();

      return {
        href: href([...components, "variants", variantType.id, "variant", record.id, "consequences", valueIndex]),
        vipC: getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVipC) as string,
        vipP:
          fieldIndexVipP !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVipP) as string[])
            : undefined,
      };
    },
  };
}

function createConfigFieldCustomVkgl(fieldMap: FieldMap): ConfigCellCustom<CellValueVkgl> | null {
  const csqField = fieldMap["INFO/CSQ"];
  if (csqField === undefined) {
    return null;
  }

  const [
    fieldIndexVkglCl,
    fieldIndexVkglAmc,
    fieldIndexVkglErasmus,
    fieldIndexVkglLumc,
    fieldIndexVkglNki,
    fieldIndexVkglRadboudMumc,
    fieldIndexVkglUmcg,
    fieldIndexVkglUmcu,
    fieldIndexVkglVumc,
  ] = getNestedFieldIndices(csqField, [
    "VKGL_CL",
    "VKGL_AMC",
    "VKGL_ERASMUS",
    "VKGL_LUMC",
    "VKGL_NKI",
    "VKGL_RADBOUD_MUMC",
    "VKGL_UMCG",
    "VKGL_UMCU",
    "VKGL_VUMC",
  ]) as [number, number, number, number, number, number, number, number, number];
  if (fieldIndexVkglCl === -1) {
    return null;
  }

  return {
    type: "composed",
    id: "vkgl",
    label: "VKGL",
    description: "VKGL consensus classification",
    valueCount: (record: Item<Record>) => getFieldValueCount(csqField, record),
    value: (record: Item<Record>, recordContext: RecordContext): CellValueVkgl => {
      const valueIndex = recordContext.valueIndex;
      if (valueIndex === undefined) throw new Error();

      return {
        vkglCl: getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglCl) as ValueString,
        vkglAmc:
          fieldIndexVkglAmc !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglAmc) as ValueString)
            : undefined,
        vkglErasmus:
          fieldIndexVkglErasmus !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglErasmus) as ValueString)
            : undefined,
        vkglLumc:
          fieldIndexVkglLumc !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglLumc) as ValueString)
            : undefined,
        vkglNki:
          fieldIndexVkglNki !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglNki) as ValueString)
            : undefined,
        vkglRadboudMumc:
          fieldIndexVkglRadboudMumc !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglRadboudMumc) as ValueString)
            : undefined,
        vkglUmcg:
          fieldIndexVkglUmcg !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglUmcg) as ValueString)
            : undefined,
        vkglUmcu:
          fieldIndexVkglUmcu !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglUmcu) as ValueString)
            : undefined,
        vkglVumc:
          fieldIndexVkglVumc !== -1
            ? (getFieldMultilineValue(csqField, record, valueIndex, fieldIndexVkglVumc) as ValueString)
            : undefined,
      };
    },
  };
}