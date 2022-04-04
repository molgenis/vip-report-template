import { ReportData } from "../api/ApiClient";
import vcf from "./vcf";
import vcfNoVep from "./vcf_noVep";
import sampleData from "./sampleDataFamily";
import vcf1Sample from "./vcf_1Sample";
import sampleData1Sample from "./sampleData1Sample";
import vcf100Samples from "./vcf_100Samples";
import sampleData100Samples from "./sampleData100Samples";
import vcfNoSample from "./vcf_NoSample";
import decisionTree from "./decisionTree";
import { Metadata } from "../api/Api";
import { dec } from "../plugin/Base85";
import { decodeReportDataObject } from "../plugin/loader";
import encodedFasta from "./encodedFasta";
import encodedGenes from "./genes";
import encodedBam from "./bam";

const dataMap = new Map<string, ReportData>();

const mockReportData: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b37_vip.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b37_vip.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: sampleData,
  binary: {
    vcf: new TextEncoder().encode(vcf),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
    bam: decodeReportDataObject({
      Patient: encodedBam,
    }),
  },
};

const mockReportDataNoVep: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b37.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b37.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: sampleData,
  binary: {
    vcf: new TextEncoder().encode(vcfNoVep),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
    bam: decodeReportDataObject({
      Patient: encodedBam,
    }),
  },
};

const mockReportData1Sample: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b37_1Sample.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b37_1Sample.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: sampleData1Sample,
  binary: {
    vcf: new TextEncoder().encode(vcf1Sample),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
    bam: decodeReportDataObject({
      SAMPLE1: encodedBam,
    }),
  },
};

const mockReportData100Samples: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b37_100Samples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b37_100Samples.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: sampleData100Samples,
  binary: {
    vcf: new TextEncoder().encode(vcf100Samples),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
  },
};

const mockReportDataNoSample: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b37_1NoSamples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b37_NoSamples.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: {},
  binary: {
    vcf: new TextEncoder().encode(vcfNoSample),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
  },
};

dataMap.set("Default", mockReportData);
dataMap.set("Trio no VEP", mockReportDataNoVep);
dataMap.set("No sample", mockReportDataNoSample);
dataMap.set("Single sample", mockReportData1Sample);
dataMap.set("Cohort", mockReportData100Samples);

export default dataMap;
