import bamUrl from "./alignment.bam.blob";
import decisionTreeJson from "./decisionTree.json";
import fastaUrl1_10042288_10042788 from "./fasta/1-10042288-10042788.fasta.gz.blob";
import fastaUrl1_16376162_16376662 from "./fasta/1-16376162-16376662.fasta.gz.blob";
import fastaUrl1_17348965_17349469 from "./fasta/1-17348965-17349469.fasta.gz.blob";
import fastaUrl1_152520538_152521038 from "./fasta/1-152520538-152521038.fasta.gz.blob";
import fastaUrl2_47635417_47635917 from "./fasta/2-47635417-47635917.fasta.gz.blob";
import fastaUrl4_106320044_106320544 from "./fasta/4-106320044-106320544.fasta.gz.blob";
import fastaUrl7_42017061_42017561 from "./fasta/7-42017061-42017561.fasta.gz.blob";
import fastaUrl7_42064707_42065207 from "./fasta/7-42064707-42065207.fasta.gz.blob";
import fastaUrl8_61764893_61765393 from "./fasta/8-61764893-61765393.fasta.gz.blob";
import fastaUrl8_145140250_145140750 from "./fasta/8-145140250-145140750.fasta.gz.blob";
import fastaUrl9_107546383_107546883 from "./fasta/9-107546383-107546883.fasta.gz.blob";
import fastaUrl10_126091249_126091749 from "./fasta/10-126091249-126091749.fasta.gz.blob";
import fastaUrl11_134013975_134014475 from "./fasta/11-134013975-134014475.fasta.gz.blob";
import fastaUrl13_77569878_77570378 from "./fasta/13-77569878-77570378.fasta.gz.blob";
import fastaUrl14_89336157_89336657 from "./fasta/14-89336157-89336657.fasta.gz.blob";
import fastaUrl14_105167610_105168110 from "./fasta/14-105167610-105168110.fasta.gz.blob";
import fastaUrl17_29555814_29556314 from "./fasta/17-29555814-29556314.fasta.gz.blob";
import fastaUrl17_29663629_29664129 from "./fasta/17-29663629-29664129.fasta.gz.blob";
import fastaUrl19_11215896_11216396 from "./fasta/19-11215896-11216396.fasta.gz.blob";
import fastaUrl19_17451747_17452247 from "./fasta/19-17451747-17452247.fasta.gz.blob";
import fastaUrl20_62326742_62327242 from "./fasta/20-62326742-62327242.fasta.gz.blob";
import fastaUrl22_50627343_50627843 from "./fasta/22-50627343-50627843.fasta.gz.blob";
import fastaUrl22_50721296_50721796 from "./fasta/22-50721296-50721796.fasta.gz.blob";
import fastaUrlX_48932771_48933271 from "./fasta/X-48932771-48933271.fasta.gz.blob";
import fastaUrlY_2655391_2655891 from "./fasta/Y-2655391-2655891.fasta.gz.blob";
import fastaUrlMT_15076_15576 from "./fasta/MT-15076-15576.fasta.gz.blob";
import genesUrl from "./genes.txt.gz.blob";
import vcfUrlFamily from "./vcf/family.vcf.blob";
import vcfUrlNoVep from "./vcf/no_vep.vcf.blob";
import vcfUrlSamples0 from "./vcf/samples_0.vcf.blob";
import vcfUrlSamples1 from "./vcf/samples_1.vcf.blob";
import vcfUrlSamples100 from "./vcf/samples_100.vcf.blob";

import { fetchAsBytes } from "../utils";
import { DecisionTree } from "@molgenis/vip-report-api/src/DecisionTree";

export const bam = await fetchAsBytes(bamUrl as string);

export const decisionTree: DecisionTree = decisionTreeJson as DecisionTree;

export const fastaGz = {
  "1:10042288-10042788": await fetchAsBytes(fastaUrl1_10042288_10042788 as string),
  "1:16376162-16376662": await fetchAsBytes(fastaUrl1_16376162_16376662 as string),
  "1:17348965-17349469": await fetchAsBytes(fastaUrl1_17348965_17349469 as string),
  "1:152520538-152521038": await fetchAsBytes(fastaUrl1_152520538_152521038 as string),
  "2:47635417-47635917": await fetchAsBytes(fastaUrl2_47635417_47635917 as string),
  "4:106320044-106320544": await fetchAsBytes(fastaUrl4_106320044_106320544 as string),
  "7:42017061-42017561": await fetchAsBytes(fastaUrl7_42017061_42017561 as string),
  "7:42064707-42065207": await fetchAsBytes(fastaUrl7_42064707_42065207 as string),
  "8:61764893-61765393": await fetchAsBytes(fastaUrl8_61764893_61765393 as string),
  "8:145140250-145140750": await fetchAsBytes(fastaUrl8_145140250_145140750 as string),
  "9:107546383-107546883": await fetchAsBytes(fastaUrl9_107546383_107546883 as string),
  "10:126091249-126091749": await fetchAsBytes(fastaUrl10_126091249_126091749 as string),
  "11:134013975-134014475": await fetchAsBytes(fastaUrl11_134013975_134014475 as string),
  "13:77569878-77570378": await fetchAsBytes(fastaUrl13_77569878_77570378 as string),
  "14:89336157-89336657": await fetchAsBytes(fastaUrl14_89336157_89336657 as string),
  "14:105167610-105168110": await fetchAsBytes(fastaUrl14_105167610_105168110 as string),
  "17:29555814-29556314": await fetchAsBytes(fastaUrl17_29555814_29556314 as string),
  "17:29663629-29664129": await fetchAsBytes(fastaUrl17_29663629_29664129 as string),
  "19:11215896-11216396": await fetchAsBytes(fastaUrl19_11215896_11216396 as string),
  "19:17451747-17452247": await fetchAsBytes(fastaUrl19_17451747_17452247 as string),
  "20:62326742-62327242": await fetchAsBytes(fastaUrl20_62326742_62327242 as string),
  "22:50627343-50627843": await fetchAsBytes(fastaUrl22_50627343_50627843 as string),
  "22:50721296-50721796": await fetchAsBytes(fastaUrl22_50721296_50721796 as string),
  "X:48932771-48933271": await fetchAsBytes(fastaUrlX_48932771_48933271 as string),
  "Y:2655391-2655891": await fetchAsBytes(fastaUrlY_2655391_2655891 as string),
  "MT:15076-15576": await fetchAsBytes(fastaUrlMT_15076_15576 as string),
};

export const genesGz = await fetchAsBytes(genesUrl as string);

export const vcfFamily = await fetchAsBytes(vcfUrlFamily as string);

export const vcfNoVep = await fetchAsBytes(vcfUrlNoVep as string);

export const vcfSamples0 = await fetchAsBytes(vcfUrlSamples0 as string);

export const vcfSamples1 = await fetchAsBytes(vcfUrlSamples1 as string);

export const vcfSamples100 = await fetchAsBytes(vcfUrlSamples100 as string);
