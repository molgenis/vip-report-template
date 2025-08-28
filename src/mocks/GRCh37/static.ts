/* eslint-disable */
// @ts-nocheck
import cramUrl from "./alignment.cram.blob";
import craiUrl from "./alignment.cram.crai.blob";
import decisionTreeJson from "./decisionTree.json";
import sampleTreeJson from "./sampleTree.json";
import fastaUrl1_10042288_10042788 from "./fasta/1-10042288-10042788.fasta.gz.blob";
import fastaUrl1_16375333_16375833 from "./fasta/1-16375333-16375833.fasta.gz.blob";
import fastaUrl1_16376162_16376662 from "./fasta/1-16376162-16376662.fasta.gz.blob";
import fastaUrl1_17348965_17349469 from "./fasta/1-17348965-17349469.fasta.gz.blob";
import fastaUrl1_17348969_17349469 from "./fasta/1-17348969-17349469.fasta.gz.blob";
import fastaUrl1_17354844_17355344 from "./fasta/1-17354844-17355344.fasta.gz.blob";
import fastaUrl1_152520538_152521038 from "./fasta/1-152520538-152521038.fasta.gz.blob";
import fastaUrl2_47635417_47635917 from "./fasta/2-47635417-47635917.fasta.gz.blob";
import fastaUrl4_106320044_106320544 from "./fasta/4-106320044-106320544.fasta.gz.blob";
import fastaUrl7_42017061_42017561 from "./fasta/7-42017061-42017561.fasta.gz.blob";
import fastaUrl7_42064707_42065207 from "./fasta/7-42064707-42065207.fasta.gz.blob";
import fastaUrl8_61764893_61765393 from "./fasta/8-61764893-61765393.fasta.gz.blob";
import fastaUrl8_145140250_145140750 from "./fasta/8-145140250-145140750.fasta.gz.blob";
import fastaUrl9_107546383_107546883 from "./fasta/9-107546383-107546883.fasta.gz.blob";
import fastaUrl9_107584614_107585114 from "./fasta/9-107584614-107585114.fasta.gz.blob";
import fastaUrl10_126091249_126091749 from "./fasta/10-126091249-126091749.fasta.gz.blob";
import fastaUrl11_134013975_134014475 from "./fasta/11-134013975-134014475.fasta.gz.blob";
import fastaUrl13_77569878_77570378 from "./fasta/13-77569878-77570378.fasta.gz.blob";
import fastaUrl14_89307588_89308088 from "./fasta/14-89307588-89308088.fasta.gz.blob";
import fastaUrl14_89309945_89310445 from "./fasta/14-89309945-89310445.fasta.gz.blob";
import fastaUrl14_89336157_89336657 from "./fasta/14-89336157-89336657.fasta.gz.blob";
import fastaUrl14_105167610_105168110 from "./fasta/14-105167610-105168110.fasta.gz.blob";
import fastaUrl17_29555814_29556314 from "./fasta/17-29555814-29556314.fasta.gz.blob";
import fastaUrl17_29585172_29585672 from "./fasta/17-29585172-29585672.fasta.gz.blob";
import fastaUrl17_29663629_29664129 from "./fasta/17-29663629-29664129.fasta.gz.blob";
import fastaUrl17_29675976_29676476 from "./fasta/17-29675976-29676476.fasta.gz.blob";
import fastaUrl17_29683733_29684233 from "./fasta/17-29683733-29684233.fasta.gz.blob";
import fastaUrl19_11215896_11216396 from "./fasta/19-11215896-11216396.fasta.gz.blob";
import fastaUrl19_11223801_11224301 from "./fasta/19-11223801-11224301.fasta.gz.blob";
import fastaUrl19_17449149_17449649 from "./fasta/19-17449149-17449649.fasta.gz.blob";
import fastaUrl19_17451747_17452247 from "./fasta/19-17451747-17452247.fasta.gz.blob";
import fastaUrl20_62326742_62327242 from "./fasta/20-62326742-62327242.fasta.gz.blob";
import fastaUrl22_50627343_50627843 from "./fasta/22-50627343-50627843.fasta.gz.blob";
import fastaUrl22_50721296_50721796 from "./fasta/22-50721296-50721796.fasta.gz.blob";
import fastaUrlX_48932771_48933271 from "./fasta/X-48932771-48933271.fasta.gz.blob";
import fastaUrlY_2655391_2655891 from "./fasta/Y-2655391-2655891.fasta.gz.blob";
import fastaUrlMT_15076_15576 from "./fasta/MT-15076-15576.fasta.gz.blob";
import genesUrl from "./genes.gff.gz.blob";
import vcfUrlFamily from "./vcf/family.vcf.blob";
/* eslint-enable */
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

export const decisionTree = decisionTreeJson as unknown as DecisionTree;

export const sampleTree = sampleTreeJson as unknown as DecisionTree;

export async function fetchFastaGz() {
  return {
    "1:10042288-10042788": await fetchAsBytes(fastaUrl1_10042288_10042788 as string),
    "1:16375333-16375833": await fetchAsBytes(fastaUrl1_16375333_16375833 as string),
    "1:16376162-16376662": await fetchAsBytes(fastaUrl1_16376162_16376662 as string),
    "1:17348965-17349469": await fetchAsBytes(fastaUrl1_17348965_17349469 as string),
    "1:17348969-17349469": await fetchAsBytes(fastaUrl1_17348969_17349469 as string),
    "1:17354844-17355344": await fetchAsBytes(fastaUrl1_17354844_17355344 as string),
    "1:152520538-152521038": await fetchAsBytes(fastaUrl1_152520538_152521038 as string),
    "2:47635417-47635917": await fetchAsBytes(fastaUrl2_47635417_47635917 as string),
    "4:106320044-106320544": await fetchAsBytes(fastaUrl4_106320044_106320544 as string),
    "7:42017061-42017561": await fetchAsBytes(fastaUrl7_42017061_42017561 as string),
    "7:42064707-42065207": await fetchAsBytes(fastaUrl7_42064707_42065207 as string),
    "8:61764893-61765393": await fetchAsBytes(fastaUrl8_61764893_61765393 as string),
    "8:145140250-145140750": await fetchAsBytes(fastaUrl8_145140250_145140750 as string),
    "9:107546383-107546883": await fetchAsBytes(fastaUrl9_107546383_107546883 as string),
    "9:107584614-107585114": await fetchAsBytes(fastaUrl9_107584614_107585114 as string),
    "10:126091249-126091749": await fetchAsBytes(fastaUrl10_126091249_126091749 as string),
    "11:134013975-134014475": await fetchAsBytes(fastaUrl11_134013975_134014475 as string),
    "13:77569878-77570378": await fetchAsBytes(fastaUrl13_77569878_77570378 as string),
    "14:89307588-89308088": await fetchAsBytes(fastaUrl14_89307588_89308088 as string),
    "14:89309945-89310445": await fetchAsBytes(fastaUrl14_89309945_89310445 as string),
    "14:89336157-89336657": await fetchAsBytes(fastaUrl14_89336157_89336657 as string),
    "14:105167610-105168110": await fetchAsBytes(fastaUrl14_105167610_105168110 as string),
    "17:29555814-29556314": await fetchAsBytes(fastaUrl17_29555814_29556314 as string),
    "17:29585172-29585672": await fetchAsBytes(fastaUrl17_29585172_29585672 as string),
    "17:29663629-29664129": await fetchAsBytes(fastaUrl17_29663629_29664129 as string),
    "17:29675976-29676476": await fetchAsBytes(fastaUrl17_29675976_29676476 as string),
    "17:29683733-29684233": await fetchAsBytes(fastaUrl17_29683733_29684233 as string),
    "19:11215896-11216396": await fetchAsBytes(fastaUrl19_11215896_11216396 as string),
    "19:11223801-11224301": await fetchAsBytes(fastaUrl19_11223801_11224301 as string),
    "19:17449149-17449649": await fetchAsBytes(fastaUrl19_17449149_17449649 as string),
    "19:17451747-17452247": await fetchAsBytes(fastaUrl19_17451747_17452247 as string),
    "20:62326742-62327242": await fetchAsBytes(fastaUrl20_62326742_62327242 as string),
    "22:50627343-50627843": await fetchAsBytes(fastaUrl22_50627343_50627843 as string),
    "22:50721296-50721796": await fetchAsBytes(fastaUrl22_50721296_50721796 as string),
    "X:48932771-48933271": await fetchAsBytes(fastaUrlX_48932771_48933271 as string),
    "Y:2655391-2655891": await fetchAsBytes(fastaUrlY_2655391_2655891 as string),
    "MT:15076-15576": await fetchAsBytes(fastaUrlMT_15076_15576 as string),
  };
}

export async function fetchGenesGz() {
  return await fetchAsBytes(genesUrl as string);
}

export const vcfMeta = vcfMetaJson as unknown as SupplementaryMetadata;

export async function fetchVcfFamily() {
  return await fetchAsBytes(vcfUrlFamily as string);
}

export const samplesFamily = {
  samples: [
    {
      person: {
        familyId: "FAM001",
        individualId: "sample0",
        paternalId: "0",
        maternalId: "0",
        sex: "MALE",
        affectedStatus: "AFFECTED",
      },
      index: 0,
      proband: true,
    },
  ],
  phenotypes: [
    {
      phenotypicFeaturesList: [
        {
          type: {
            id: "HP:0001627",
            label: "HP:0001627",
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
        id: "sample0",
      },
    },
  ],
};
