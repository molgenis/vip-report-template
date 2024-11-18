import { afterEach, describe, expect, test, vi } from "vitest";
import { initConfigFilterComposed } from "../../../src/utils/config/configFiltersComposed.ts";
import { MetadataContainer, SampleContainer } from "../../../src/utils/api.ts";
import { ConfigStaticFieldComposed, ConfigVip } from "../../../src/types/config";
import {
  ConfigFilterAllelicImbalance,
  ConfigFilterDeNovo,
  ConfigFilterHpo,
  ConfigFilterInheritanceMatch,
  ConfigFilterLocus,
  ConfigFilterVipC,
  ConfigFilterVipCS,
} from "../../../src/types/configFilterComposed";
import {
  FieldMetadataWrapper,
  getInfoNestedField,
  getSampleField,
  getSampleFields,
  parseContigIds,
} from "../../../src/utils/vcf.ts";
import { PhenotypicFeature } from "@molgenis/vip-report-api";

describe("config filters composed", () => {
  vi.mock(import("../../../src/utils/vcf.ts"));

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initConfigFiltersComposed", () => {
    const vcfMetadata = {};
    const metadata = { records: vcfMetadata } as MetadataContainer;
    const configVip = {} as ConfigVip;

    test("invalid config", () => {
      expect(() =>
        initConfigFilterComposed(
          {
            type: "composed",
            name: "invalid",
          },
          configVip,
          metadata,
          null,
        ),
      ).toThrow(/^config invalid: unknown composed filter name 'invalid'$/);
    });

    describe("hpo", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "hpo",
      };
      const sample = {
        phenotypes: [
          { type: { id: "HP:0000951", label: "HP:0000951 label" } },
          {
            type: {
              id: "HP:0000952",
              label: "HP:0000952 label",
            },
          },
        ],
      } as SampleContainer;

      test("hpo", () => {
        const fieldHpo = { id: "CSQ/HPO" };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldHpo as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterHpo;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("hpo");
        expect(filter.field).toStrictEqual({
          ...fieldHpo,
          categories: {
            "HP:0000951": {
              label: "HP:0000951 label",
            },
            "HP:0000952": {
              label: "HP:0000952 label",
            },
          },
        });
        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "HPO");
      });

      test("hpo with field label and description", () => {
        const fieldHpo = {
          id: "CSQ/HPO",
          label: "field_label",
          description: "field_description",
        };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldHpo as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterHpo;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("hpo with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldHpo = { id: "CSQ/HPO" };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldHpo as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(config, configVip, metadata, sample) as ConfigFilterHpo;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("hpo is null when sample has no phenotypes", () => {
        const sample = {
          phenotypes: [] as PhenotypicFeature[],
        } as SampleContainer;

        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
      });

      test("hpo is null when sample is null", () => {
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
      });

      test("hpo is null when metadata absent", () => {
        vi.mocked(getInfoNestedField).mockReturnValue(undefined);
        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "HPO");
      });
    });

    describe("locus", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "locus",
      };

      test("locus", () => {
        vi.mocked(parseContigIds).mockReturnValue(["chr1", "chr2"]);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, null) as ConfigFilterLocus;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("locus");
        expect(filter.label()).toStrictEqual("Locus");
        expect(filter.description()).toStrictEqual(null);
        expect(filter.chromosomes).toStrictEqual(["chr1", "chr2"]);

        expect(parseContigIds).toHaveBeenCalledWith(vcfMetadata);
      });

      test("locus with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const filter = initConfigFilterComposed(config, configVip, metadata, null) as ConfigFilterLocus;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });
    });

    describe("allelicImbalance", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "allelicImbalance",
      };
      const sample = {} as SampleContainer;

      test("allelicImbalance", () => {
        const fieldViab = { id: "FORMAT/VIAB" };
        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldViab, fieldGt] as FieldMetadataWrapper[]);

        const filter = initConfigFilterComposed(
          configBase,
          configVip,
          metadata,
          sample,
        ) as ConfigFilterAllelicImbalance;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("allelicImbalance");
        expect(filter.label()).toStrictEqual("VIAB");
        expect(filter.description()).toStrictEqual(null);
        expect(filter.sample).toStrictEqual(sample);
        expect(filter.viabField).toStrictEqual(fieldViab);
        expect(filter.genotypeField).toStrictEqual(fieldGt);

        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "VIAB", "GT");
      });

      test("allelicImbalance with field label and description", () => {
        const fieldViab = { id: "FORMAT/VIAB", label: "field_label", description: "field_description" };
        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldViab, fieldGt] as FieldMetadataWrapper[]);

        const filter = initConfigFilterComposed(
          configBase,
          configVip,
          metadata,
          sample,
        ) as ConfigFilterAllelicImbalance;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("allelicImbalance with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldViab = { id: "FORMAT/VIAB" };
        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([fieldViab, fieldGt] as FieldMetadataWrapper[]);

        const filter = initConfigFilterComposed(config, configVip, metadata, sample) as ConfigFilterAllelicImbalance;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("allelicImbalance null for absent sample", () => {
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
      });

      test("allelicImbalance null for absent metadata", () => {
        const fieldGt = { id: "FORMAT/GT" };
        vi.mocked(getSampleFields).mockReturnValue([undefined, fieldGt] as FieldMetadataWrapper[]);
        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
        expect(getSampleFields).toHaveBeenCalledWith(vcfMetadata, "VIAB", "GT");
      });
    });

    describe("inheritanceMatch", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "inheritanceMatch",
      };
      const sample = {} as SampleContainer;

      test("inheritanceMatch", () => {
        const fieldVim = { id: "FORMAT/VIM" };
        vi.mocked(getSampleField).mockReturnValue(fieldVim as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(
          configBase,
          configVip,
          metadata,
          sample,
        ) as ConfigFilterInheritanceMatch;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("inheritanceMatch");
        expect(filter.label()).toStrictEqual("VIM");
        expect(filter.description()).toStrictEqual(null);
        expect(filter.sample).toStrictEqual(sample);
        expect(filter.vimField).toStrictEqual({ ...fieldVim, required: true });

        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIM");
      });

      test("inheritanceMatch with field label and description", () => {
        const fieldVim = { id: "FORMAT/VIM", label: "field_label", description: "field_description" };
        vi.mocked(getSampleField).mockReturnValue(fieldVim as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(
          configBase,
          configVip,
          metadata,
          sample,
        ) as ConfigFilterInheritanceMatch;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("inheritanceMatch with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldVim = { id: "FORMAT/VIM" };
        vi.mocked(getSampleField).mockReturnValue(fieldVim as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(config, configVip, metadata, sample) as ConfigFilterInheritanceMatch;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("inheritanceMatch null for absent sample", () => {
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
      });

      test("inheritanceMatch null for absent metadata", () => {
        vi.mocked(getSampleField).mockReturnValue(undefined);
        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIM");
      });
    });

    describe("deNovo", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "deNovo",
      };
      const sample = {} as SampleContainer;

      test("deNovo", () => {
        const fieldVid = { id: "FORMAT/VID" };
        vi.mocked(getSampleField).mockReturnValue(fieldVid as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterDeNovo;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("deNovo");
        expect(filter.label()).toStrictEqual("VID");
        expect(filter.description()).toStrictEqual(null);
        expect(filter.sample).toStrictEqual(sample);
        expect(filter.vidField).toStrictEqual({ ...fieldVid, required: true });

        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VID");
      });

      test("deNovo with field label and description", () => {
        const fieldVid = { id: "FORMAT/VID", label: "field_label", description: "field_description" };
        vi.mocked(getSampleField).mockReturnValue(fieldVid as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterDeNovo;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("deNovo with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        const fieldVid = { id: "FORMAT/VID" };
        vi.mocked(getSampleField).mockReturnValue(fieldVid as FieldMetadataWrapper);

        const filter = initConfigFilterComposed(config, configVip, metadata, sample) as ConfigFilterDeNovo;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("deNovo null for absent sample", () => {
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
      });

      test("deNovo null for absent metadata", () => {
        vi.mocked(getSampleField).mockReturnValue(undefined);
        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VID");
      });
    });

    describe("vipC", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "vipC",
      };
      const configVip = { params: { vcf: { filter: { classes: "a,c" } } } } as ConfigVip;
      const fieldVipCBase: FieldMetadataWrapper = {
        id: "CSQ/VIPC",
        type: "CATEGORICAL",
        number: { type: "NUMBER", count: 1 },
        categories: { a: { label: "a_label" }, b: { label: "b_label" }, c: { label: "c_label" } },
        index: 0,
      };

      test("vipC", () => {
        vi.mocked(getInfoNestedField).mockReturnValue(fieldVipCBase);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, null) as ConfigFilterVipC;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("vipC");
        expect(filter.field).toStrictEqual({
          ...fieldVipCBase,
          categories: { a: { label: "a_label" }, c: { label: "c_label" } },
        });
        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPC");
      });

      test("vipC with field label and description", () => {
        const fieldVipC: FieldMetadataWrapper = {
          ...fieldVipCBase,
          label: "field_label",
          description: "field_description",
        };
        vi.mocked(getInfoNestedField).mockReturnValue(fieldVipC);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, null) as ConfigFilterVipC;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("vipC with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        vi.mocked(getInfoNestedField).mockReturnValue(fieldVipCBase);

        const filter = initConfigFilterComposed(config, configVip, metadata, null) as ConfigFilterVipC;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("vipC is null when metadata absent", () => {
        vi.mocked(getInfoNestedField).mockReturnValue(undefined);
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
        expect(getInfoNestedField).toHaveBeenCalledWith(vcfMetadata, "CSQ", "VIPC");
      });
    });

    describe("vipCS", () => {
      const configBase: ConfigStaticFieldComposed = {
        type: "composed",
        name: "vipCS",
      };
      const configVip = { params: { vcf: { filter_samples: { classes: "a,c" } } } } as ConfigVip;
      const fieldVipCSBase: FieldMetadataWrapper = {
        id: "FORMAT/VIPC_S",
        type: "CATEGORICAL",
        number: { type: "NUMBER", count: 1 },
        categories: { a: { label: "a_label" }, b: { label: "b_label" }, c: { label: "c_label" } },
        index: 0,
      };
      const sample = { item: { id: 2 } } as SampleContainer;

      test("vipCS", () => {
        vi.mocked(getSampleField).mockReturnValue(fieldVipCSBase);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterVipCS;
        expect(filter.type).toStrictEqual("composed");
        expect(filter.id).toStrictEqual("vipCS");
        expect(filter.field).toStrictEqual({
          ...fieldVipCSBase,
          categories: { a: { label: "a_label" }, c: { label: "c_label" } },
        });
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIPC_S");
      });

      test("vipCS with field label and description", () => {
        const fieldVipCS: FieldMetadataWrapper = {
          ...fieldVipCSBase,
          label: "field_label",
          description: "field_description",
        };
        vi.mocked(getSampleField).mockReturnValue(fieldVipCS);

        const filter = initConfigFilterComposed(configBase, configVip, metadata, sample) as ConfigFilterVipCS;
        expect(filter.label()).toStrictEqual("field_label");
        expect(filter.description()).toStrictEqual("field_description");
      });

      test("vipCS with custom label and description", () => {
        const config: ConfigStaticFieldComposed = {
          ...configBase,
          label: "my_label",
          description: "my_description",
        };

        vi.mocked(getSampleField).mockReturnValue(fieldVipCSBase);

        const filter = initConfigFilterComposed(config, configVip, metadata, sample) as ConfigFilterVipCS;
        expect(filter.label()).toStrictEqual("my_label");
        expect(filter.description()).toStrictEqual("my_description");
      });

      test("vipCS is null when sample is null", () => {
        expect(initConfigFilterComposed(configBase, configVip, metadata, null)).toStrictEqual(null);
      });

      test("vipCS is null when metadata absent", () => {
        vi.mocked(getSampleField).mockReturnValue(undefined);
        expect(initConfigFilterComposed(configBase, configVip, metadata, sample)).toStrictEqual(null);
        expect(getSampleField).toHaveBeenCalledWith(vcfMetadata, "VIPC_S");
      });
    });
  });
});
