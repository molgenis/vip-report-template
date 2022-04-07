import { ReportData } from "../api/ApiClient";
import vcfFamily from "./GRCh37/vcf";
import vcfNoVep from "./GRCh37/vcf_noVep";
import sampleData from "./sampleDataFamily";
import vcf1Sample from "./GRCh37/vcf_1Sample";
import sampleData1Sample from "./sampleData1Sample";
import vcf100Samples from "./GRCh37/vcf_100Samples";
import sampleData100Samples from "./sampleData100Samples";
import vcfNoSample from "./GRCh38/vcf_NoSample";
import vcfFamilyGRCh38 from "./GRCh38/vcf";
import vcfNoVepGRCh38 from "./GRCh38/vcf_noVep";
import vcf1SampleGRCh38 from "./GRCh38/vcf_1Sample";
import vcf100SamplesGRCh38 from "./GRCh38/vcf_100Samples";
import vcfNoSampleGRCh38 from "./GRCh37/vcf_NoSample";
import decisionTree from "./decisionTree";
import { Metadata } from "../api/Api";
import { dec } from "../plugin/Base85";
import { decodeReportDataObject } from "../plugin/loader";
import encodedFasta from "./GRCh37/encodedFasta";
import encodedGenes from "./GRCh37/encodedGenes";
import encodedBam from "./GRCh37/encodedBam";
import encodedFastaGRCh38 from "./GRCh38/encodedFasta";
import encodedGenesGRCh38 from "./GRCh38/encodedGenes";
import encodedBamGRCh38 from "./GRCh38/encodedBam";

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
    vcf: new TextEncoder().encode(vcfFamily),
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
  data: { samples: [] },
  binary: {
    vcf: new TextEncoder().encode(vcfNoSample),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFasta),
    genesGz: dec(encodedGenes),
  },
};

const mockReportDataFamilyGRCh38: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b38_vip.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b38_vip.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh38",
    },
  } as Metadata,
  data: sampleData,
  binary: {
    vcf: new TextEncoder().encode(vcfFamilyGRCh38),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFastaGRCh38),
    genesGz: dec(encodedGenesGRCh38),
    bam: decodeReportDataObject({
      Patient: encodedBamGRCh38,
    }),
  },
};

const mockReportDataNoVepGRCh38: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b38.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b38.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh38",
    },
  } as Metadata,
  data: sampleData,
  binary: {
    vcf: new TextEncoder().encode(vcfNoVepGRCh38),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFastaGRCh38),
    genesGz: dec(encodedGenesGRCh38),
    bam: decodeReportDataObject({
      Patient: encodedBamGRCh38,
    }),
  },
};

const mockReportData1SampleGRCh38: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b38_1Sample.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b38_1Sample.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh38",
    },
  } as Metadata,
  data: sampleData1Sample,
  binary: {
    vcf: new TextEncoder().encode(vcf1SampleGRCh38),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFastaGRCh38),
    genesGz: dec(encodedGenesGRCh38),
    bam: decodeReportDataObject({
      SAMPLE1: encodedBamGRCh38,
    }),
  },
};

const mockReportData100SamplesGRCh38: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b38_100Samples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b38_100Samples.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh38",
    },
  } as Metadata,
  data: sampleData100Samples,
  binary: {
    vcf: new TextEncoder().encode(vcf100SamplesGRCh38),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFastaGRCh38),
    genesGz: dec(encodedGenesGRCh38),
  },
};

const mockReportDataNoSampleGRCh38: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i testdata_b38_1NoSamples.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "testdata_b38_NoSamples.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh38",
    },
  } as Metadata,
  data: { samples: [] },
  binary: {
    vcf: new TextEncoder().encode(vcfNoSampleGRCh38),
    decisionTree: new TextEncoder().encode(decisionTree),
    fastaGz: decodeReportDataObject(encodedFastaGRCh38),
    genesGz: dec(encodedGenesGRCh38),
  },
};

dataMap.set("Family GRCh37", mockReportData);
dataMap.set("Family no VEP GRCh37", mockReportDataNoVep);
dataMap.set("No sample GRCh37", mockReportDataNoSample);
dataMap.set("Single sample GRCh37", mockReportData1Sample);
dataMap.set("Cohort GRCh37", mockReportData100Samples);
dataMap.set("Family GRCh38", mockReportDataFamilyGRCh38);
dataMap.set("Family no VEP GRCh38", mockReportDataNoVepGRCh38);
dataMap.set("No sample GRCh38", mockReportDataNoSampleGRCh38);
dataMap.set("Single sample GRCh38", mockReportData1SampleGRCh38);
dataMap.set("Cohort GRCh38", mockReportData100SamplesGRCh38);
export default dataMap;
