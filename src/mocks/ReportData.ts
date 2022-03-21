import { ReportData } from "../api/ApiClient";
import vcf from "./vcf";
import decisionTree from "./decisionTree";
import { Metadata } from "../api/Api";

const reportData: ReportData = {
  metadata: {
    app: {
      name: "vcf-report",
      version: "0.0.8",
      args: "-i patient_mother_father.vcf -t /Users/user/vip-report-template/dist/vip-report-template.html -f",
    },
    htsFile: {
      uri: "patient_mother_father.vcf",
      htsFormat: "VCF",
      genomeAssembly: "GRCh37",
    },
  } as Metadata,
  data: {
    samples: {
      items: [
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
          proband: true,
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
          proband: true,
        },
      ],
      total: 3,
    },
    phenotypes: {
      items: [
        {
          phenotypicFeaturesList: [
            {
              type: {
                id: "HP:0000518",
                label: "HP:0000518",
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
                id: "HP:0000518",
                label: "HP:0000518",
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
                id: "HP:0000518",
                label: "HP:0000518",
              },
            },
          ],
          subject: {
            id: "Father",
          },
        },
      ],
      total: 3,
    },
  },
  binary: {
    vcf: new TextEncoder().encode(vcf),
    decisionTree: new TextEncoder().encode(decisionTree),
  },
};

export default reportData;
