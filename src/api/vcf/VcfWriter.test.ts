import { expect, test } from "vitest";
import { writeVcf } from "./VcfWriter";
import { parseVcf } from "./VcfParser";

test("parse and write vcf: ID,REF,ALT,QUAL,FILTER", () => {
  expect(writeVcf(parseVcf(vcfIdRefAltQualFilter))).toBe(vcfIdRefAltQualFilter);
});

test("parse and write vcf: Numbers", () => {
  expect(writeVcf(parseVcf(vcfInfoNumber))).toBe(vcfInfoNumber);
});

test("parse and write vcf: Types", () => {
  expect(writeVcf(parseVcf(vcfInfoType))).toBe(vcfInfoType);
});

test("parse and write vcf: Value escaping", () => {
  expect(writeVcf(parseVcf(vcfInfoTypeStringCornerCases))).toBe(vcfInfoTypeStringCornerCases);
});

test("parse and write vcf: Float corner cases", () => {
  expect(writeVcf(parseVcf(vcfInfoTypeFloatCornerCases))).toBe(vcfInfoTypeFloatCornerCasesExpected);
});

test("parse and write vcf: Nested", () => {
  expect(writeVcf(parseVcf(vcfInfoNested))).toBe(vcfInfoNested);
});

test("parse and write vcf: Samples", () => {
  expect(writeVcf(parseVcf(vcfSamples))).toBe(vcfSamples);
});

test("parse and write vcf: Samples filtered", () => {
  const expectedVcfSamples = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE1\tSAMPLE2
1\t1\t.\tA\tG\t.\t.\t.\tGT:GQ:HQ\t0/1:.:4,5\t1/1
`;
  expect(writeVcf(parseVcf(vcfSamples), { samples: ["SAMPLE1", "SAMPLE2"] })).toBe(expectedVcfSamples);
});

const vcfIdRefAltQualFilter = `##fileformat=VCFv4.2
##FILTER=<ID=q10,Description="Quality below 10">
##FILTER=<ID=q20,Description="Quality below 20">
##FILTER=<ID=PASS,Description="All filters passed">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t25\tPASS\t.
1\t2\tid0\tA\tG,T\t15\tq10\t.
1\t3\tid1;id2\tA\t.\t5.5\tq10;q20\t.
1\t4\t.\tA\tG,.\t.\t.\t.
`;

const vcfInfoNumber = `##fileformat=VCFv4.2
##INFO=<ID=STR_A,Number=A,Type=String,Description="String:A">
##INFO=<ID=STR_R,Number=R,Type=String,Description="String:R">
##INFO=<ID=STR_G,Number=G,Type=String,Description="String:G">
##INFO=<ID=STR_X,Number=.,Type=String,Description="String:X">
##INFO=<ID=STR_1,Number=1,Type=String,Description="String:1">
##INFO=<ID=STR_2,Number=2,Type=String,Description="String:2">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0
1\t1\t.\tA\t.\t.\t.\tSTR_R=A;STR_G=H;STR_X=B,C,D;STR_1=E;STR_2=F,G\tGT\t0|1
1\t2\t.\tA\tG\t.\t.\tSTR_A=A;STR_R=B,C;STR_G=J;STR_X=D,E,F;STR_1=G;STR_2=H,I\tGT\t0|1
1\t3\t.\tA\tG,T\t.\t.\tSTR_A=A,B;STR_R=C,D,E;STR_G=L;STR_X=F,G,H;STR_1=I;STR_2=J,K\tGT\t0|1
`;

const vcfInfoType = `##fileformat=VCFv4.2
##INFO=<ID=CHAR,Number=.,Type=Character,Description="Character">
##INFO=<ID=FLAG,Number=0,Type=Flag,Description="Flag">
##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float">
##INFO=<ID=INT,Number=.,Type=Integer,Description="Integer">
##INFO=<ID=STRING,Number=.,Type=String,Description="String">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tCHAR=X;FLAG;FLOAT=1.2;INT=3;STRING=ABC
`;

const vcfInfoTypeStringCornerCases = `##fileformat=VCFv4.2
##INFO=<ID=STRING,Number=.,Type=String,Description="String">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tSTRING=%3A%3B%3D%25%2C%0D%0A%09
`;

const vcfInfoTypeFloatCornerCases = `##fileformat=VCFv4.2
##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float corner cases">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tFLOAT=INF,INFINITY,+inf,+infinity,-INF,-INFINITY,NaN,NAN
`;

const vcfInfoTypeFloatCornerCasesExpected = `##fileformat=VCFv4.2
##INFO=<ID=FLOAT,Number=.,Type=Float,Description="Float corner cases">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\t.\tFLOAT=Infinity,Infinity,Infinity,Infinity,-Infinity,-Infinity,NaN,NaN
`;

const vcfInfoNested = `##fileformat=VCFv4.2
##INFO=<ID=CSQ,Number=.,Type=String,Description="Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|ALLELE_NUM|DISTANCE|STRAND|FLAGS|PICK|SYMBOL_SOURCE|HGNC_ID|REFSEQ_MATCH|REFSEQ_OFFSET|SOURCE|SIFT|PolyPhen|HGVS_OFFSET|CLIN_SIG|SOMATIC|PHENO|PUBMED|CHECK_REF|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS|SpliceAI_pred_DP_AG|SpliceAI_pred_DP_AL|SpliceAI_pred_DP_DG|SpliceAI_pred_DP_DL|SpliceAI_pred_DS_AG|SpliceAI_pred_DS_AL|SpliceAI_pred_DS_DG|SpliceAI_pred_DS_DL|SpliceAI_pred_SYMBOL|CAPICE_CL|CAPICE_SC|IncompletePenetrance|InheritanceModesGene|VKGL_CL|gnomAD|gnomAD_AF|gnomAD_HN">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
1\t1\t.\tA\tG\t.\tPASS\tCSQ=G|splice_acceptor_variant&intro_variant|HIGH|SHOX|6473|Transcript|NM_000451.3|protein_coding||2/5|c.278-2A>G||||||||1||1||1|EntrezGene||||||||||||||||||20|2|20|2|0.06|0.98|0.00|0.00|SHOX|VUS|0.97629046|1|XL||||,G|splice_acceptor_variant|HIGH|SHOX|6473|Transcript|NM_006883.2|protein_coding||2/5|c.278-2A>G||||||||1||1|||EntrezGene||||||||||||||||||20|2|20|2|0.06|0.98|0.00|0.00|SHOX|VUS|0.97629046|1|XL||||,G|regulatory_region_variant|MODIFIER|||RegulatoryFeature|ENSR00002094130|open_chromatin_region|||||||||||1|||||||||||||||||||||||||||||||||||||||
`;

const vcfSamples = `##fileformat=VCFv4.2
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##FORMAT=<ID=HQ,Number=2,Type=Integer,Description="Haplotype Quality">
##contig=<ID=1,length=249250621,assembly=b37>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE0\tSAMPLE1\tSAMPLE2
1\t1\t.\tA\tG\t.\t.\t.\tGT:GQ:HQ\t0|1:1:2,3\t0/1:.:4,5\t1/1
`;
