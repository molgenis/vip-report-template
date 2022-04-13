import { ReportData } from "../api/ApiClient";
import { Metadata } from "../api/Api";
import {
  bam as bamGRCh37,
  decisionTree as decisionTreeGRCh37,
  fastaGz as fastaGzGRCh37,
  genesGz as genesGzGRCh37,
  vcfFamily as vcfFamilyGRCh37,
  vcfNoVep as vcfNoVepGRCh37,
  vcfSamples0 as vcfSamples0GRCh37,
  vcfSamples1 as vcfSamples1GRCh37,
  vcfSamples100 as vcfSamples100GRCh37,
} from "./GRCh37/static";
import {
  bam as bamGRCh38,
  decisionTree as decisionTreeGRCh38,
  fastaGz as fastaGzGRCh38,
  genesGz as genesGzGRCh38,
  vcfFamily as vcfFamilyGRCh38,
  vcfNoVep as vcfNoVepGRCh38,
  vcfSamples0 as vcfSamples0GRCh38,
  vcfSamples1 as vcfSamples1GRCh38,
  vcfSamples100 as vcfSamples100GRCh38,
} from "./GRCh38/static";
import { samples1, samples100, samplesFamily } from "./static";

const dataMap: { [key: string]: ReportData } = {};

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
  data: samplesFamily,
  binary: {
    vcf: vcfFamilyGRCh37,
    decisionTree: decisionTreeGRCh37,
    fastaGz: fastaGzGRCh37,
    genesGz: genesGzGRCh37,
    bam: {
      Patient: bamGRCh37,
    },
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
  data: samplesFamily,
  binary: {
    vcf: vcfNoVepGRCh37,
    decisionTree: decisionTreeGRCh37,
    fastaGz: fastaGzGRCh37,
    genesGz: genesGzGRCh37,
    bam: {
      Patient: bamGRCh37,
    },
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
  data: samples1,
  binary: {
    vcf: vcfSamples1GRCh37,
    decisionTree: decisionTreeGRCh37,
    fastaGz: fastaGzGRCh37,
    genesGz: genesGzGRCh37,
    bam: {
      SAMPLE1: bamGRCh37,
    },
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
  data: samples100,
  binary: {
    vcf: vcfSamples100GRCh37,
    decisionTree: decisionTreeGRCh37,
    fastaGz: fastaGzGRCh37,
    genesGz: genesGzGRCh37,
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
    vcf: vcfSamples0GRCh37,
    decisionTree: decisionTreeGRCh37,
    fastaGz: fastaGzGRCh37,
    genesGz: genesGzGRCh37,
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
  data: samplesFamily,
  binary: {
    vcf: vcfFamilyGRCh38,
    decisionTree: decisionTreeGRCh38,
    fastaGz: fastaGzGRCh38,
    genesGz: genesGzGRCh38,
    bam: {
      Patient: bamGRCh38,
    },
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
  data: samplesFamily,
  binary: {
    vcf: vcfNoVepGRCh38,
    decisionTree: decisionTreeGRCh38,
    fastaGz: fastaGzGRCh38,
    genesGz: genesGzGRCh38,
    bam: {
      Patient: bamGRCh38,
    },
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
  data: samples1,
  binary: {
    vcf: vcfSamples1GRCh38,
    decisionTree: decisionTreeGRCh38,
    fastaGz: fastaGzGRCh38,
    genesGz: genesGzGRCh38,
    bam: {
      SAMPLE1: bamGRCh38,
    },
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
  data: samples100,
  binary: {
    vcf: vcfSamples100GRCh38,
    decisionTree: decisionTreeGRCh38,
    fastaGz: fastaGzGRCh38,
    genesGz: genesGzGRCh38,
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
    vcf: vcfSamples0GRCh38,
    decisionTree: decisionTreeGRCh38,
    fastaGz: fastaGzGRCh38,
    genesGz: genesGzGRCh38,
  },
};

dataMap["GRCh37 Family"] = mockReportData;
dataMap["GRCh37 Family no VEP"] = mockReportDataNoVep;
dataMap["GRCh37 Samples 0"] = mockReportDataNoSample;
dataMap["GRCh37 Samples 1"] = mockReportData1Sample;
dataMap["GRCh37 Samples 100"] = mockReportData100Samples;
dataMap["GRCh38 Family"] = mockReportDataFamilyGRCh38;
dataMap["GRCh38 Family no VEP"] = mockReportDataNoVepGRCh38;
dataMap["GRCh38 Samples 0"] = mockReportDataNoSampleGRCh38;
dataMap["GRCh38 Samples 1"] = mockReportData1SampleGRCh38;
dataMap["GRCh38 Samples 100"] = mockReportData100SamplesGRCh38;
export default dataMap;
