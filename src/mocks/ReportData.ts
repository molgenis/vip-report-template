import { ReportData } from "../api/ApiClient";
import vcf from "./vcf";
import vcfNoVep from "./vcf_noVep";
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
  data: {
    samples: [
      {
        person: {
          familyId: "FAM001",
          individualId: "Patient",
          paternalId: "Father",
          maternalId: "Mother",
          sex: "MALE",
          affectedStatus: "AFFECTED",
        },
        index: 0,
        proband: true,
      },
      {
        person: {
          familyId: "FAM001",
          individualId: "Mother",
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
        index: 2,
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
          id: "Mother",
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
  },
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
  data: {
    samples: [
      {
        person: {
          familyId: "FAM001",
          individualId: "Patient",
          paternalId: "Father",
          maternalId: "Mother",
          sex: "MALE",
          affectedStatus: "AFFECTED",
        },
        index: 0,
        proband: true,
      },
      {
        person: {
          familyId: "FAM001",
          individualId: "Mother",
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
        index: 2,
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
          id: "Mother",
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
  },
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

dataMap.set("Default", mockReportData);
dataMap.set("Trio no VEP", mockReportDataNoVep);

export default dataMap;
