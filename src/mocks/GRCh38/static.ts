/* eslint-disable */
// @ts-nocheck
import cramUrl from "./alignment.cram.blob";
import craiUrl from "./alignment.cram.crai.blob";
import strCramUrl from "./str.cram.blob";
import strCraiUrl from "./str.cram.crai.blob";
import fastaUrl_chr1_9982230_9982730 from "./fasta/chr1-9982230-9982730.fasta.gz.blob";
import fastaUrl_chr1_16049667_16050167 from "./fasta/chr1-16049667-16050167.fasta.gz.blob";
import fastaUrl_chr1_17022474_17022974 from "./fasta/chr1-17022474-17022974.fasta.gz.blob";
import fastaUrl_chr1_149380406_149403321 from "./fasta/chr1-149380406-149403321.fasta.gz.blob";
import fastaUrl_chr1_152548062_152548562 from "./fasta/chr1-152548062-152548562.fasta.gz.blob";
import fastaUrl_chr2_47408278_47408778 from "./fasta/chr2-47408278-47408778.fasta.gz.blob";
import fastaUrl_chr4_105398887_105399387 from "./fasta/chr4-105398887-105399387.fasta.gz.blob";
import fastaUrl_chr7_41977462_41977962 from "./fasta/chr7-41977462-41977962.fasta.gz.blob";
import fastaUrl_chr7_42025108_42025608 from "./fasta/chr7-42025108-42025608.fasta.gz.blob";
import fastaUrl_chr8_60852334_60852834 from "./fasta/chr8-60852334-60852834.fasta.gz.blob";
import fastaUrl_chr8_144085347_144085847 from "./fasta/chr8-144085347-144085847.fasta.gz.blob";
import fastaUrl_chr9_104784102_104784602 from "./fasta/chr9-104784102-104784602.fasta.gz.blob";
import fastaUrl_chr10_124402680_124403180 from "./fasta/chr10-124402680-124403180.fasta.gz.blob";
import fastaUrl_chr11_134144080_134144580 from "./fasta/chr11-134144080-134144580.fasta.gz.blob";
import fastaUrl_chr13_76995743_76996243 from "./fasta/chr13-76995743-76996243.fasta.gz.blob";
import fastaUrl_chr14_88869813_88870313 from "./fasta/chr14-88869813-88870313.fasta.gz.blob";
import fastaUrl_chr14_104701273_104701773 from "./fasta/chr14-104701273-104701773.fasta.gz.blob";
import fastaUrl_chr17_31228796_31229296 from "./fasta/chr17-31228796-31229296.fasta.gz.blob";
import fastaUrl_chr17_31336611_31337111 from "./fasta/chr17-31336611-31337111.fasta.gz.blob";
import fastaUrl_chr19_11105220_11105720 from "./fasta/chr19-11105220-11105720.fasta.gz.blob";
import fastaUrl_chr19_17340938_17341438 from "./fasta/chr19-17340938-17341438.fasta.gz.blob";
import fastaUrl_chr20_63695389_63695889 from "./fasta/chr20-63695389-63695889.fasta.gz.blob";
import fastaUrl_chr22_50188914_50189414 from "./fasta/chr22-50188914-50189414.fasta.gz.blob";
import fastaUrl_chr22_50282867_50283367 from "./fasta/chr22-50282867-50283367.fasta.gz.blob";
import fastaUrl_chrM_15075_15575 from "./fasta/chrM-15075-15575.fasta.gz.blob";
import fastaUrl_chrX_49075112_49075612 from "./fasta/chrX-49075112-49075612.fasta.gz.blob";
import fastaUrl_chrY_2787350_2787850 from "./fasta/chrY-2787350-2787850.fasta.gz.blob";
import genesUrl from "./genes.gff.gz.blob";
import vcfUrlFamily from "./vcf/family.vcf.blob";
import vcfUrlNoVep from "./vcf/no_vep.vcf.blob";
import vcfUrlSamples0 from "./vcf/samples_0.vcf.blob";
import vcfUrlSamples1 from "./vcf/samples_1.vcf.blob";
import vcfUrlSamples100 from "./vcf/samples_100.vcf.blob";
import vcfUrlStr from "./vcf/str.vcf.blob";
/* eslint-enable */
import decisionTreeJson from "./decisionTree.json";
import decisionTreeStrJson from "./decisionTreeStr.json";
import sampleTreeJson from "./sampleTree.json";
import vcfMetaJson from "./field_metadata.json";
import { fetchAsBytes } from "../utils";
import { DecisionTree } from "@molgenis/vip-report-api";
import { SupplementaryMetadata } from "@molgenis/vip-report-vcf";

export async function fetchCram() {
  return await fetchAsBytes(cramUrl as string);
}

export async function fetchCrai() {
  return await fetchAsBytes(craiUrl as string);
}

export async function fetchStrCram() {
  return await fetchAsBytes(strCramUrl as string);
}

export async function fetchStrCrai() {
  return await fetchAsBytes(strCraiUrl as string);
}

export const decisionTree: DecisionTree = decisionTreeJson as unknown as DecisionTree;
export const decisionTreeStr: DecisionTree = decisionTreeStrJson as unknown as DecisionTree;
export const sampleTree: DecisionTree = sampleTreeJson as unknown as DecisionTree;

export async function fetchFastaGz() {
  return {
    "chr1:9982230-9982730": await fetchAsBytes(fastaUrl_chr1_9982230_9982730 as string),
    "chr1:16049667-16050167": await fetchAsBytes(fastaUrl_chr1_16049667_16050167 as string),
    "chr1:17022474-17022974": await fetchAsBytes(fastaUrl_chr1_17022474_17022974 as string),
    "chr1:149380406-149403321": await fetchAsBytes(fastaUrl_chr1_149380406_149403321 as string),
    "chr1:152548062-152548562": await fetchAsBytes(fastaUrl_chr1_152548062_152548562 as string),
    "chr2:47408278-47408778": await fetchAsBytes(fastaUrl_chr2_47408278_47408778 as string),
    "chr4:105398887-105399387": await fetchAsBytes(fastaUrl_chr4_105398887_105399387 as string),
    "chr7:41977462-41977962": await fetchAsBytes(fastaUrl_chr7_41977462_41977962 as string),
    "chr7:42025108-42025608": await fetchAsBytes(fastaUrl_chr7_42025108_42025608 as string),
    "chr8:60852334-60852834": await fetchAsBytes(fastaUrl_chr8_60852334_60852834 as string),
    "chr8:144085347-144085847": await fetchAsBytes(fastaUrl_chr8_144085347_144085847 as string),
    "chr9:104784102-104784602": await fetchAsBytes(fastaUrl_chr9_104784102_104784602 as string),
    "chr10:124402680-124403180": await fetchAsBytes(fastaUrl_chr10_124402680_124403180 as string),
    "chr11:134144080-134144580": await fetchAsBytes(fastaUrl_chr11_134144080_134144580 as string),
    "chr13:76995743-76996243": await fetchAsBytes(fastaUrl_chr13_76995743_76996243 as string),
    "chr14:88869813-88870313": await fetchAsBytes(fastaUrl_chr14_88869813_88870313 as string),
    "chr14:104701273-104701773": await fetchAsBytes(fastaUrl_chr14_104701273_104701773 as string),
    "chr17:31228796-31229296": await fetchAsBytes(fastaUrl_chr17_31228796_31229296 as string),
    "chr17:31336611-31337111": await fetchAsBytes(fastaUrl_chr17_31336611_31337111 as string),
    "chr19:11105220-11105720": await fetchAsBytes(fastaUrl_chr19_11105220_11105720 as string),
    "chr19:17340938-17341438": await fetchAsBytes(fastaUrl_chr19_17340938_17341438 as string),
    "chr20:63695389-63695889": await fetchAsBytes(fastaUrl_chr20_63695389_63695889 as string),
    "chr22:50188914-50189414": await fetchAsBytes(fastaUrl_chr22_50188914_50189414 as string),
    "chr22:50282867-50283367": await fetchAsBytes(fastaUrl_chr22_50282867_50283367 as string),
    "chrX:49075112-49075612": await fetchAsBytes(fastaUrl_chrX_49075112_49075612 as string),
    "chrY:2787350-2787850": await fetchAsBytes(fastaUrl_chrY_2787350_2787850 as string),
    "chrM:15075-15575": await fetchAsBytes(fastaUrl_chrM_15075_15575 as string),
  };
}

export async function fetchGenesGz() {
  return await fetchAsBytes(genesUrl as string);
}

export const vcfMeta = vcfMetaJson as unknown as SupplementaryMetadata;

export async function fetchVcfFamily() {
  return await fetchAsBytes(vcfUrlFamily as string);
}

export async function fetchVcfNoVep() {
  return await fetchAsBytes(vcfUrlNoVep as string);
}

export async function fetchVcfSamples0() {
  return await fetchAsBytes(vcfUrlSamples0 as string);
}

export async function fetchVcfSamples1() {
  return await fetchAsBytes(vcfUrlSamples1 as string);
}

export async function fetchVcfSamples100() {
  return await fetchAsBytes(vcfUrlSamples100 as string);
}

export async function fetchVcfStr() {
  return await fetchAsBytes(vcfUrlStr as string);
}

export const samplesStr = {
  samples: [
    {
      person: {
        familyId: "FAM001",
        individualId: "Patient",
        sex: "FEMALE",
        affectedStatus: "AFFECTED",
      },
      index: 0,
      proband: true,
    },
  ],
  phenotypes: [],
};

export const samplesFamily = {
  samples: [
    {
      person: {
        familyId: "FAM001",
        individualId: "Patient",
        paternalId: "Father",
        maternalId: "MotherHasQuiteALongName",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 3,
      proband: true,
      filter_classes: ["U1", "U2"],
    },
    {
      person: {
        familyId: "FAM001",
        individualId: "MotherHasQuiteALongName",
        paternalId: "0",
        maternalId: "0",
        sex: "FEMALE",
        affectedStatus: "UNAFFECTED",
      },
      index: 1,
      proband: false,
    },
    {
      person: {
        familyId: "FAM001",
        individualId: "Father",
        paternalId: "0",
        maternalId: "0",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 0,
      proband: false,
    },
  ],
  phenotypes: [
    {
      phenotypicFeaturesList: [
        {
          type: {
            id: "HP:0000951",
            label: "HP:0000951",
          },
        },
        {
          type: {
            id: "HP:0003124",
            label: "HP:0003124",
          },
        },
      ],
      subject: {
        id: "Patient",
      },
    },
    {
      phenotypicFeaturesList: [
        {
          type: {
            id: "HP:0000951",
            label: "HP:0000951",
          },
        },
      ],
      subject: {
        id: "MotherHasQuiteALongName",
      },
    },
    {
      phenotypicFeaturesList: [
        {
          type: {
            id: "HP:0000951",
            label: "HP:0000951",
          },
        },
      ],
      subject: {
        id: "Father",
      },
    },
  ],
};
