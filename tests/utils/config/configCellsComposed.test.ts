import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigCellComposed } from "../../../src/utils/config/configCellsComposed.ts";
import { MetadataContainer, SampleContainer } from "../../../src/utils/api.ts";
import { VariantType } from "../../../src/utils/variantType.ts";
import { ConfigJsonFieldComposed } from "../../../src/types/config";
import { ConfigCellCustom } from "../../../src/types/configCells";
import { CellValueCustom } from "../../../src/types/configCellComposed";
import {
  FieldMetadataWrapper,
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
} from "../../../src/utils/vcf.ts";
import { Item, Sample } from "@molgenis/vip-report-api";
import { VcfRecord } from "@molgenis/vip-report-vcf";

describe("config cells composed", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initConfigCellComposed", () => {
    const variantType = { id: "snv" } as VariantType;
    const vcfMetadata = {};
    const metadata = { records: vcfMetadata } as MetadataContainer;
    const record = { id: 0, data: { c: "chr1", p: 123, r: "A", a: ["C", "T"] } } as Item<VcfRecord>;

    describe("clinVar", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "clinVar",
      };

      test("clinVar with required fields", () => {
        const fieldClinSig = { id: "CSQ/clinVar_CLNSIG" };
        vi.mocked(getInfoNestedFields).mockReturnValue([fieldClinSig as FieldMetadataWrapper, undefined, undefined]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([0, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("clinVar");
        expect(cell.label()).toStrictEqual("ClinVar");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({ clnSigs: 0, clnIds: undefined, clnRevStats: undefined });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "clinVar_CLNSIG",
          "clinVar_CLNID",
          "clinVar_CLNREVSTAT",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldClinSig);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldClinSig, undefined, undefined);
      });

      test("clinVar with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldClinSig = { id: "CSQ/clinVar_CLNSIG" };
        const fieldClnId = { id: "CSQ/clinVar_CLNID" };
        const fieldClnRevStat = { id: "CSQ/clinVar_CLNREVSTAT" };
        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldClinSig,
          fieldClnId,
          fieldClnRevStat,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([0, 1, 2]);

        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("clinVar");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({ clnSigs: 0, clnIds: 1, clnRevStats: 2 });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "clinVar_CLNSIG",
          "clinVar_CLNID",
          "clinVar_CLNREVSTAT",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldClinSig);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldClinSig, fieldClnId, fieldClnRevStat);
      });

      test("clinVar without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([undefined, undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "clinVar_CLNSIG",
          "clinVar_CLNID",
          "clinVar_CLNREVSTAT",
        );
      });
    });

    describe("gene", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "gene",
      };

      test("gene with required fields", () => {
        const fieldSymbol = { id: "CSQ/SYMBOL" };
        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldSymbol as FieldMetadataWrapper,
          undefined,
          undefined,
          undefined,
        ]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue(["my_symbol", undefined, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("gene");
        expect(cell.label()).toStrictEqual("Gene");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          symbol: "my_symbol",
          geneIdentifier: undefined,
          incompletePenetrance: undefined,
          symbolSource: undefined,
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "SYMBOL",
          "Gene",
          "IncompletePenetrance",
          "SYMBOL_SOURCE",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldSymbol);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldSymbol, undefined, undefined, undefined);
      });

      test("gene with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldSymbol = { id: "CSQ/SYMBOL" };
        const fieldGene = { id: "CSQ/Gene" };
        const fieldIncPen = { id: "CSQ/IncompletePenetrance" };
        const fieldSymbolSource = { id: "CSQ/SYMBOL_SOURCE" };

        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldSymbol,
          fieldGene,
          fieldIncPen,
          fieldSymbolSource,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue(["my_symbol", "my_gene", true, "my_symbol_source"]);

        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("gene");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          symbol: "my_symbol",
          geneIdentifier: "my_gene",
          incompletePenetrance: true,
          symbolSource: "my_symbol_source",
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "SYMBOL",
          "Gene",
          "IncompletePenetrance",
          "SYMBOL_SOURCE",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldSymbol);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldSymbol, fieldGene, fieldIncPen, fieldSymbolSource);
      });

      test("gene without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "SYMBOL",
          "Gene",
          "IncompletePenetrance",
          "SYMBOL_SOURCE",
        );
      });
    });

    describe("genotype", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "genotype",
      };
      const sample = { item: { id: 2, data: { person: { individualId: "sample2" } } } } as SampleContainer;

      test("genotype with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldGt = { id: "FORMAT/GT" };
        const fieldRepCn = { id: "FORMAT/REPCN" };
        const fieldViab = { id: "FORMAT/VIAB" };
        const fieldSvType = { id: "INFO/SVTYPE" };
        const fieldRu = { id: "INFO/RU" };
        const fieldRuMatch = { id: "INFO/RUMATCH" };
        const fieldDisplayRu = { id: "INFO/DisplayRU" };
        vi.mocked(getSampleFields).mockReturnValue([fieldGt, fieldRepCn, fieldViab] as FieldMetadataWrapper[]);
        vi.mocked(getInfoFields).mockReturnValue([
          fieldSvType,
          fieldRu,
          fieldRuMatch,
          fieldDisplayRu,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getSampleValues).mockReturnValue([0, 1, 2]);
        vi.mocked(getInfoValues).mockReturnValue([3, 4, 5, 6]);

        const cell = initConfigCellComposed(config, variantType, metadata, sample) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("genotype");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          altAlleles: ["C", "T"],
          displayRepeatUnit: 6,
          genotype: 0,
          refAllele: "A",
          repeatCount: 1,
          repeatUnitMatch: 5,
          repeatUnitValue: 4,
          svType: 3,
          viab: 2,
        });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "GT", "REPCN", "VIAB");
        expect(getInfoFields).toHaveBeenCalledWith(vcfMetadata, "SVTYPE", "RU", "RUMATCH", "DisplayRU");
        expect(getSampleValues).toHaveBeenCalledWith(sample, record, 1, fieldGt, fieldRepCn, fieldViab);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldSvType, fieldRu, fieldRuMatch, fieldDisplayRu);
      });

      test("genotype with required fields", () => {
        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldGt, undefined, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getInfoFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getSampleValues).mockReturnValue([0, undefined, undefined]);
        vi.mocked(getInfoValues).mockReturnValue([undefined, undefined, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("genotype");
        expect(cell.label()).toStrictEqual("sample2");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          altAlleles: ["C", "T"],
          displayRepeatUnit: undefined,
          genotype: 0,
          refAllele: "A",
          repeatCount: undefined,
          repeatUnitMatch: undefined,
          repeatUnitValue: undefined,
          svType: undefined,
          viab: undefined,
        });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "GT", "REPCN", "VIAB");
        expect(getInfoFields).toHaveBeenCalledWith(vcfMetadata, "SVTYPE", "RU", "RUMATCH", "DisplayRU");
        expect(getSampleValues).toHaveBeenCalledWith(sample, record, 1, fieldGt, undefined, undefined);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, undefined, undefined, undefined, undefined);
      });

      test("genotype without required fields", () => {
        vi.mocked(getSampleFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, sample)).toStrictEqual(null);
        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "GT", "REPCN", "VIAB");
      });

      test("genotype without sample", () => {
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
      });
    });

    describe("genotype_maternal", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "genotype_maternal",
      };

      test("genotype_maternal with required fields", () => {
        const sampleMaternal = { id: 2, data: { person: { individualId: "sample2_maternal" } } } as Item<Sample>;
        const sample = {
          item: { id: 2, data: { person: { individualId: "sample2" } } },
          maternalSample: sampleMaternal,
        } as SampleContainer;

        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldGt, undefined, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getInfoFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getSampleValues).mockReturnValue([0, undefined, undefined]);
        vi.mocked(getInfoValues).mockReturnValue([undefined, undefined, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("genotype");
        expect(cell.label()).toStrictEqual("sample2_maternal");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          altAlleles: ["C", "T"],
          displayRepeatUnit: undefined,
          genotype: 0,
          refAllele: "A",
          repeatCount: undefined,
          repeatUnitMatch: undefined,
          repeatUnitValue: undefined,
          svType: undefined,
          viab: undefined,
        });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "GT", "REPCN", "VIAB");
        expect(getInfoFields).toHaveBeenCalledWith(vcfMetadata, "SVTYPE", "RU", "RUMATCH", "DisplayRU");
        expect(getSampleValues).toHaveBeenCalledWith(
          {
            item: {
              data: { person: { individualId: "sample2_maternal" } },
              id: 2,
            },
            maternalSample: null,
            otherPedigreeSamples: [],
            paternalSample: null,
            phenotypes: [],
            variantTypeIds: new Set(),
          },
          record,
          1,
          fieldGt,
          undefined,
          undefined,
        );
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, undefined, undefined, undefined, undefined);
      });

      test("genotype_maternal no sample", () => {
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
      });

      test("genotype_maternal no mother", () => {
        const sample = {
          item: { id: 2, data: { person: { individualId: "sample2" } } },
          maternalSample: null,
        } as SampleContainer;
        expect(initConfigCellComposed(configBase, variantType, metadata, sample)).toStrictEqual(null);
      });
    });

    describe("genotype_paternal", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "genotype_paternal",
      };

      test("genotype_paternal with required fields", () => {
        const samplePaternal = { id: 2, data: { person: { individualId: "sample2_paternal" } } } as Item<Sample>;
        const sample = {
          item: { id: 2, data: { person: { individualId: "sample2" } } },
          paternalSample: samplePaternal,
        } as SampleContainer;

        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldGt, undefined, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getInfoFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getSampleValues).mockReturnValue([0, undefined, undefined]);
        vi.mocked(getInfoValues).mockReturnValue([undefined, undefined, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("genotype");
        expect(cell.label()).toStrictEqual("sample2_paternal");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          altAlleles: ["C", "T"],
          displayRepeatUnit: undefined,
          genotype: 0,
          refAllele: "A",
          repeatCount: undefined,
          repeatUnitMatch: undefined,
          repeatUnitValue: undefined,
          svType: undefined,
          viab: undefined,
        });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "GT", "REPCN", "VIAB");
        expect(getInfoFields).toHaveBeenCalledWith(vcfMetadata, "SVTYPE", "RU", "RUMATCH", "DisplayRU");
        expect(getSampleValues).toHaveBeenCalledWith(
          {
            item: {
              data: { person: { individualId: "sample2_paternal" } },
              id: 2,
            },
            maternalSample: null,
            otherPedigreeSamples: [],
            paternalSample: null,
            phenotypes: [],
            variantTypeIds: new Set(),
          },
          record,
          1,
          fieldGt,
          undefined,
          undefined,
        );
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, undefined, undefined, undefined, undefined);
      });

      test("genotype_paternal no sample", () => {
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
      });

      test("genotype_paternal no father", () => {
        const sample = {
          item: { id: 2, data: { person: { individualId: "sample2" } } },
          paternalSample: null,
        } as SampleContainer;
        expect(initConfigCellComposed(configBase, variantType, metadata, sample)).toStrictEqual(null);
      });
    });

    describe("gnomAdAf", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "gnomAdAf",
      };

      test("gnomAdAf with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldGnomAdAf = { id: "gnomAD_AF" };
        const fieldGnomAdCov = { id: "gnomAD_COV" };
        const fieldGnomAdQc = { id: "gnomAD_QC" };
        const fieldAlleleNum = { id: "ALLELE_NUM" };

        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldGnomAdAf,
          fieldGnomAdCov,
          fieldGnomAdQc,
          fieldAlleleNum,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([0.12, 0.23, ["qc"], 0]);

        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("gnomAdAf");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          c: "chr1",
          p: 123,
          r: "A",
          a: ["C", "T"],
          gnomAdAf: 0.12,
          gnomAdCov: 0.23,
          gnomAdQcs: ["qc"],
          alleleNum: 0,
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "gnomAD_AF",
          "gnomAD_COV",
          "gnomAD_QC",
          "ALLELE_NUM",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldGnomAdAf);
        expect(getInfoValues).toHaveBeenCalledWith(
          record,
          1,
          fieldGnomAdAf,
          fieldGnomAdCov,
          fieldGnomAdQc,
          fieldAlleleNum,
        );
      });

      test("gnomAdAf with required fields", () => {
        const fieldGnomAdAf = { id: "gnomAD_AF" };

        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldGnomAdAf,
          undefined,
          undefined,
          undefined,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([0.12, undefined, undefined, undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("gnomAdAf");
        expect(cell.label()).toStrictEqual("gnomAD AF");
        expect(cell.description()).toStrictEqual("gnomAD allele frequency");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          c: "chr1",
          p: 123,
          r: "A",
          a: ["C", "T"],
          gnomAdAf: 0.12,
          gnomAdCov: undefined,
          gnomAdQcs: undefined,
          alleleNum: undefined,
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "gnomAD_AF",
          "gnomAD_COV",
          "gnomAD_QC",
          "ALLELE_NUM",
        );
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldGnomAdAf);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldGnomAdAf, undefined, undefined, undefined);
      });

      test("gnomAdAf without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([undefined, undefined, undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
          "CSQ",
          "gnomAD_AF",
          "gnomAD_COV",
          "gnomAD_QC",
          "ALLELE_NUM",
        );
      });
    });

    describe("hpo", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "hpo",
      };

      test("hpo with required fields", () => {
        const fieldHpo = { id: "CSQ/HPO" };
        vi.mocked(getInfoNestedFields).mockReturnValue([fieldHpo, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([["HP:0000951"], undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("hpo");
        expect(cell.label()).toStrictEqual("HPO");
        expect(cell.description()).toStrictEqual("Human phenotype ontology matches");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({ hpos: ["HP:0000951"], gadoPd: undefined });

        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "HPO", "GADO_PD");
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldHpo);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldHpo, undefined);
      });

      test("hpo with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldHpo = { id: "CSQ/HPO" };
        const fieldGadoPd = { id: "CSQ/GADO_PD" };
        vi.mocked(getInfoNestedFields).mockReturnValue([fieldHpo, fieldGadoPd] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([["HP:0000951"], "HC"]);

        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("hpo");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({ hpos: ["HP:0000951"], gadoPd: "HC" });

        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "HPO", "GADO_PD");
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldHpo);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldHpo, fieldGadoPd);
      });

      test("hpo without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "HPO", "GADO_PD");
      });
    });

    describe("inheritancePattern", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "inheritancePattern",
      };
      const sample = { item: { id: 2 } } as SampleContainer;

      test("inheritancePattern with required and optional fields, with sample", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldInhModesGene = { id: "CSQ/InheritanceModesGene" };
        const fieldVic = { id: "FORMAT/VIC" };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldInhModesGene as FieldMetadataWrapper);
        vi.mocked(getSampleField).mockReturnValue(fieldVic as FieldMetadataWrapper);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValue).mockReturnValue(0);
        vi.mocked(getSampleValue).mockReturnValue(1);

        const cell = initConfigCellComposed(config, variantType, metadata, sample) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("inheritancePattern");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          fieldInheritanceModesGene: fieldInhModesGene,
          inheritanceModesGene: 0,
          isPossibleCompound: 1,
        });

        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "InheritanceModesGene");
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIC");
        expect(getInfoValue).toHaveBeenCalledWith(record, 1, fieldInhModesGene);
        expect(getSampleValue).toHaveBeenCalledWith(sample, record, 1, fieldVic);
      });

      test("inheritancePattern with required and optional fields, without sample", () => {
        const fieldInhModesGene = { id: "CSQ/InheritanceModesGene" };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldInhModesGene as FieldMetadataWrapper);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValue).mockReturnValue(0);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("inheritancePattern");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          fieldInheritanceModesGene: fieldInhModesGene,
          inheritanceModesGene: 0,
          isPossibleCompound: undefined,
        });

        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "InheritanceModesGene");
        expect(getInfoValue).toHaveBeenCalledWith(record, 1, fieldInhModesGene);
      });

      test("inheritancePattern with required fields, with sample", () => {
        const fieldInhModesGene = { id: "CSQ/InheritanceModesGene" };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldInhModesGene as FieldMetadataWrapper);
        vi.mocked(getSampleField).mockReturnValue(undefined);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValue).mockReturnValue(0);
        vi.mocked(getSampleValue).mockReturnValue(undefined);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("inheritancePattern");
        expect(cell.label()).toStrictEqual("Inh.Pat.");
        expect(cell.description()).toStrictEqual("Inheritance pattern");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          fieldInheritanceModesGene: fieldInhModesGene,
          inheritanceModesGene: 0,
          isPossibleCompound: undefined,
        });

        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "InheritanceModesGene");
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIC");
        expect(getInfoValue).toHaveBeenCalledWith(record, 1, fieldInhModesGene);
        expect(getSampleValue).toHaveBeenCalledWith(sample, record, 1, undefined);
      });

      test("inheritancePattern without required fields", () => {
        vi.mocked(getInfoNestedField).mockReturnValue(undefined);
        expect(initConfigCellComposed(configBase, variantType, metadata, sample)).toStrictEqual(null);
        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "InheritanceModesGene");
      });
    });

    describe("locus", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "locus",
      };

      test("locus with sample", () => {
        const config = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };
        const sample = { item: { id: 2 } } as SampleContainer;
        const cell = initConfigCellComposed(config, variantType, metadata, sample) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("locus");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          c: "chr1",
          href: "/samples/2/variants/snv/variant/0",
          p: 123,
        });
      });

      test("locus without sample", () => {
        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("locus");
        expect(cell.label()).toStrictEqual("Position");
        expect(cell.description()).toStrictEqual(null);
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          c: "chr1",
          href: "/variants/snv/variant/0",
          p: 123,
        });
      });
    });

    describe("ref", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "ref",
      };

      test("ref with default label and description", () => {
        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("ref");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          ref: "A",
        });
      });

      test("ref with custom label and description", () => {
        const config = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };
        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("ref");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          ref: "A",
        });
      });
    });

    describe("vipC", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "vipC",
      };

      test("vipC with required fields, without sample", () => {
        const fieldVipC = { id: "CSQ/VIPC" };
        vi.mocked(getInfoNestedFields).mockReturnValue([fieldVipC, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue(["LP", undefined]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vipC");
        expect(cell.label()).toStrictEqual("VIP");
        expect(cell.description()).toStrictEqual("VIP classification");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          href: "/variants/snv/variant/0/consequences/1",
          vipC: "LP",
          vipP: undefined,
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPC", "VIPP");
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldVipC);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldVipC, undefined);
      });

      test("vipC with required and optional fields, with sample", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };
        const sample = { item: { id: 2 } } as SampleContainer;
        const fieldVipC = { id: "CSQ/VIPC" };
        const fieldVipP = { id: "CSQ/VIPP" };
        vi.mocked(getInfoNestedFields).mockReturnValue([fieldVipC, fieldVipP] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue(["LP", ["x", "y"]]);

        const cell = initConfigCellComposed(config, variantType, metadata, sample) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vipC");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          href: "/samples/2/variants/snv/variant/0/consequences/1",
          vipC: "LP",
          vipP: ["x", "y"],
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPC", "VIPP");
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldVipC);
        expect(getInfoValues).toHaveBeenCalledWith(record, 1, fieldVipC, fieldVipP);
      });

      test("vipC without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPC", "VIPP");
      });
    });

    describe("vipCS", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "vipCS",
      };
      const sample = { item: { id: 2 } } as SampleContainer;

      test("vipCS with required fields", () => {
        const fieldVipCS = { id: "FORMAT/VIPC_S" };
        vi.mocked(getSampleFields).mockReturnValue([fieldVipCS, undefined] as FieldMetadataWrapper[]);
        vi.mocked(getSampleValue).mockReturnValue(["1", "2"]);
        vi.mocked(getSampleValues).mockReturnValue([
          [
            { value: "U1", label: "U1 label" },
            { value: "U2", label: "U2 label" },
          ],
          undefined,
        ]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vipCS");
        expect(cell.label()).toStrictEqual("VIP sample");
        expect(cell.description()).toStrictEqual("VIP sample classification");
        expect(cell.valueCount(record)).toStrictEqual(2);
        expect(cell.value(record, 1)).toStrictEqual({ vipCS: { value: "U2", label: "U2 label" }, vipPS: undefined });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "VIPC_S", "VIPP_S");
        expect(getSampleValue).toHaveBeenCalledWith(sample, record, 0, fieldVipCS);
        expect(getSampleValues).toHaveBeenCalledWith(sample, record, 0, fieldVipCS, undefined);
      });

      test("vipCS with required and optional fields", () => {
        const fieldVipCS = { id: "FORMAT/VIPC_S" };
        const fieldVipPS = { id: "FORMAT/VIPP_S" };
        vi.mocked(getSampleFields).mockReturnValue([fieldVipCS, fieldVipPS] as FieldMetadataWrapper[]);
        vi.mocked(getSampleValue).mockReturnValue(["x"]);
        vi.mocked(getSampleValues).mockReturnValue([[{ value: "U1", label: "U1 label" }], ["a&b&c"]]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          sample,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vipCS");
        expect(cell.label()).toStrictEqual("VIP sample");
        expect(cell.description()).toStrictEqual("VIP sample classification");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 0)).toStrictEqual({
          vipCS: { value: "U1", label: "U1 label" },
          vipPS: ["a", "b", "c"],
        });

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "VIPC_S", "VIPP_S");
        expect(getSampleValue).toHaveBeenCalledWith(sample, record, 0, fieldVipCS);
        expect(getSampleValues).toHaveBeenCalledWith(sample, record, 0, fieldVipCS, fieldVipPS);
      });

      test("vipCS without sample", () => {
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
      });

      test("vipCS without required metadata", () => {
        vi.mocked(getSampleFields).mockReturnValue([undefined, undefined]);
        expect(initConfigCellComposed(configBase, variantType, metadata, sample)).toStrictEqual(null);
      });
    });

    describe("vkgl", () => {
      const configBase: ConfigJsonFieldComposed = {
        type: "composed",
        name: "vkgl",
      };

      test("vkgl with required fields", () => {
        const fieldVkglCl = { id: "CSQ/VKGL_CL" };
        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldVkglCl,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue([
          "B",
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ]);

        const cell = initConfigCellComposed(
          configBase,
          variantType,
          metadata,
          null,
        ) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vkgl");
        expect(cell.label()).toStrictEqual("VKGL");
        expect(cell.description()).toStrictEqual("VKGL consensus classification");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          vkglCl: "B",
          vkglAmc: undefined,
          vkglErasmus: undefined,
          vkglLumc: undefined,
          vkglNki: undefined,
          vkglRadboudMumc: undefined,
          vkglUmcg: undefined,
          vkglUmcu: undefined,
          vkglVumc: undefined,
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
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
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldVkglCl);
        expect(getInfoValues).toHaveBeenCalledWith(
          record,
          1,
          fieldVkglCl,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        );
      });

      test("vkgl with required and optional fields", () => {
        const config: ConfigJsonFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldVkglCl = { id: "CSQ/VKGL_CL" };
        const fieldVkglAmc = { id: "CSQ/VKGL_AMC" };
        const fieldVkglErasmus = { id: "CSQ/VKGL_ERASMUS" };
        const fieldVkglLumc = { id: "CSQ/VKGL_LUMC" };
        const fieldVkglNki = { id: "CSQ/VKGL_NKI" };
        const fieldVkglRadboud = { id: "CSQ/VKGL_RADBOUD_MUMC" };
        const fieldVkglUmcg = { id: "CSQ/VKGL_UMCG" };
        const fieldVkglUmcu = { id: "CSQ/VKGL_UMCU" };
        const fieldVkglVumc = { id: "CSQ/VKGL_VUMC" };
        vi.mocked(getInfoNestedFields).mockReturnValue([
          fieldVkglCl,
          fieldVkglAmc,
          fieldVkglErasmus,
          fieldVkglLumc,
          fieldVkglNki,
          fieldVkglRadboud,
          fieldVkglUmcg,
          fieldVkglUmcu,
          fieldVkglVumc,
        ] as FieldMetadataWrapper[]);
        vi.mocked(getInfoValueCount).mockReturnValue(1);
        vi.mocked(getInfoValues).mockReturnValue(["B", "LB", "VUS", "LP", "P", "LP", "VUS", "LB", "B"]);

        const cell = initConfigCellComposed(config, variantType, metadata, null) as ConfigCellCustom<CellValueCustom>;
        expect(cell.type).toStrictEqual("composed");
        expect(cell.id).toStrictEqual("vkgl");
        expect(cell.label()).toStrictEqual("my_label");
        expect(cell.description()).toStrictEqual("my_description");
        expect(cell.valueCount(record)).toStrictEqual(1);
        expect(cell.value(record, 1)).toStrictEqual({
          vkglCl: "B",
          vkglAmc: "LB",
          vkglErasmus: "VUS",
          vkglLumc: "LP",
          vkglNki: "P",
          vkglRadboudMumc: "LP",
          vkglUmcg: "VUS",
          vkglUmcu: "LB",
          vkglVumc: "B",
        });

        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
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
        expect(getInfoValueCount).toHaveBeenCalledWith(record, fieldVkglCl);
        expect(getInfoValues).toHaveBeenCalledWith(
          record,
          1,
          fieldVkglCl,
          fieldVkglAmc,
          fieldVkglErasmus,
          fieldVkglLumc,
          fieldVkglNki,
          fieldVkglRadboud,
          fieldVkglUmcg,
          fieldVkglUmcu,
          fieldVkglVumc,
        );
      });

      test("vkgl without required fields", () => {
        vi.mocked(getInfoNestedFields).mockReturnValue([
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ]);
        expect(initConfigCellComposed(configBase, variantType, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedFields).toHaveBeenCalledWith(
          vcfMetadata,
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
      });
    });
  });
});
