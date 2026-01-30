// noinspection TypeScriptUnresolvedReference

import { JTDSchemaType } from "ajv/dist/types/jtd-schema";
import {
  ConfigJson,
  ConfigJsonField,
  ConfigJsonFilter,
  ConfigJsonRecordsPerPageOption,
  ConfigJsonSort,
  ConfigJsonSortOrder, ConfigJsonVariant, ConfigJsonVariantConsequence,
  ConfigJsonVariants,
  ConfigJsonVip,
  ConfigJsonVipParams,
  ConfigJsonVipParamsCram,
  ConfigJsonVipParamsVcf
} from "../../src/types/config";

// allow additional properties so we can extend config in vip without updating vip-report-template
const schemaConfigJsonVipParamsVcf: JTDSchemaType<ConfigJsonVipParamsVcf> = {
  properties: {
    filter: {
      properties: { classes: { type: "string" }, consequences: { type: "boolean" } },
      additionalProperties: true,
    },
    filter_samples: {
      properties: { classes: { type: "string" } },
      additionalProperties: true,
    },
  },
  additionalProperties: true,
};

// allow additional properties so we can extend config in vip without updating vip-report-template
const schemaConfigJsonVipParamsCram: JTDSchemaType<ConfigJsonVipParamsCram> = {
  properties: {
    call_snv: { type: "boolean" },
    call_str: { type: "boolean" },
    call_sv: { type: "boolean" },
    call_cnv: { type: "boolean" },
  },
  additionalProperties: true,
};

// allow additional properties so we can extend config in vip without updating vip-report-template
const schemaConfigJsonVipParams: JTDSchemaType<ConfigJsonVipParams> = {
  properties: {
    vcf: schemaConfigJsonVipParamsVcf,
  },
  optionalProperties: {
    cram: schemaConfigJsonVipParamsCram,
  },
  additionalProperties: true,
};

const schemaConfigJsonVip: JTDSchemaType<ConfigJsonVip> = {
  properties: {
    filter_field: {
      properties: { type: { enum: ["genotype"] }, name: { type: "string" } },
      optionalProperties: { label: { type: "string" }, description: { type: "string" } },
    },
    params: schemaConfigJsonVipParams,
  },
};

const schemaConfigJsonField: JTDSchemaType<ConfigJsonField> = {
  discriminator: "type",
  mapping: {
    fixed: {
      properties: {
        name: { enum: ["chrom", "pos", "id", "ref", "alt", "qual", "filter"] },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
      },
    },
    info: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
      },
    },
    format: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
      },
    },
    genotype: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
      },
    },
    composed: {
      properties: {
        name: {
          enum: [
            "clinVar",
            "confidenceInterval",
            "gene",
            "genotype",
            "genotype_maternal",
            "genotype_paternal",
            "gnomAdAf",
            "hpo",
            "inheritancePattern",
            "locus",
            "spanningReads",
            "vipC",
            "vipCS",
            "vkgl",
          ],
        },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
      },
    },
    group: {
      // TODO deduplicate code, see mappings listed above
      properties: {
        fields: {
          elements: {
            discriminator: "type",
            mapping: {
              fixed: {
                properties: {
                  name: { enum: ["chrom", "pos", "id", "ref", "alt", "qual", "filter"] },
                },
                optionalProperties: {
                  label: { type: "string" },
                  description: { type: "string" },
                },
              },
              info: {
                properties: {
                  name: { type: "string" },
                },
                optionalProperties: {
                  label: { type: "string" },
                  description: { type: "string" },
                },
              },
              format: {
                properties: {
                  name: { type: "string" },
                },
                optionalProperties: {
                  label: { type: "string" },
                  description: { type: "string" },
                },
              },
              genotype: {
                properties: {
                  name: { type: "string" },
                },
                optionalProperties: {
                  label: { type: "string" },
                  description: { type: "string" },
                },
              },
              composed: {
                properties: {
                  name: {
                    enum: [
                      "clinVar",
                      "gene",
                      "genotype",
                      "gnomAdAf",
                      "hpo",
                      "inheritancePattern",
                      "locus",
                      "ref",
                      "vipC",
                      "vipCS",
                      "vkgl",
                    ],
                  },
                },
                optionalProperties: {
                  label: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};

const schemaConfigJsonFilter: JTDSchemaType<ConfigJsonFilter> = {
  discriminator: "type",
  mapping: {
    fixed: {
      properties: {
        name: { enum: ["chrom", "pos", "id", "ref", "alt", "qual", "filter"] },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
        defaultValue: { type: "string" }
      },
    },
    info: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
        defaultValue: { type: "string" }
      },
    },
    format: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
        defaultValue: { type: "string" }
      },
    },
    genotype: {
      properties: {
        name: { type: "string" },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
        defaultValue: { type: "string" }
      },
    },
    composed: {
      properties: {
        name: {
          enum: ["allelicImbalance", "deNovo", "hpo", "inheritanceMatch", "locus", "vipC", "vipCS"],
        },
      },
      optionalProperties: {
        label: { type: "string" },
        description: { type: "string" },
        defaultValue: { type: "string" }
      },
    },
  },
};

const schemaConfigJsonSortOrder: JTDSchemaType<ConfigJsonSortOrder> = {
  properties: {
    direction: { enum: ["asc", "desc"] },
    field: schemaConfigJsonField,
  },
};

const schemaConfigJsonSort: JTDSchemaType<ConfigJsonSort> = {
  properties: {
    selected: { type: "boolean" },
    orders: {
      elements: schemaConfigJsonSortOrder,
    },
  },
};

const schemaConfigJsonRecordsPerPageOption: JTDSchemaType<ConfigJsonRecordsPerPageOption> = {
  properties: {
    number: { type: "uint16" },
  },
  optionalProperties: {
    selected: { type: "boolean" },
  },
};

const schemaConfigJsonVariants: JTDSchemaType<ConfigJsonVariants> = {
  properties: {
    cells: {
      optionalProperties: {
        all: { elements: schemaConfigJsonField },
        snv: { elements: schemaConfigJsonField },
        str: { elements: schemaConfigJsonField },
        sv: { elements: schemaConfigJsonField },
      },
    },
  },
  optionalProperties: {
    filters: {
      optionalProperties: {
        all: { elements: schemaConfigJsonFilter },
        snv: { elements: schemaConfigJsonFilter },
        str: { elements: schemaConfigJsonFilter },
        sv: { elements: schemaConfigJsonFilter },
      },
    },
    sorts: {
      optionalProperties: {
        all: { elements: schemaConfigJsonSort },
        snv: { elements: schemaConfigJsonSort },
        str: { elements: schemaConfigJsonSort },
        sv: { elements: schemaConfigJsonSort },
      },
    },
    recordsPerPage: {
      optionalProperties: {
        all: { elements: schemaConfigJsonRecordsPerPageOption },
        snv: { elements: schemaConfigJsonRecordsPerPageOption },
        str: { elements: schemaConfigJsonRecordsPerPageOption },
        sv: { elements: schemaConfigJsonRecordsPerPageOption },
      },
    },
  },
};

const schemaConfigJsonVariant: JTDSchemaType<ConfigJsonVariant> = {
  properties: {
    cells: {
      optionalProperties: {
        all: { elements: schemaConfigJsonField },
        snv: { elements: schemaConfigJsonField },
        str: { elements: schemaConfigJsonField },
        sv: { elements: schemaConfigJsonField },
      },
    },
  },
  optionalProperties: {
    sample_cells: {
      optionalProperties: {
        all: { elements: schemaConfigJsonField },
        snv: { elements: schemaConfigJsonField },
        str: { elements: schemaConfigJsonField },
        sv: { elements: schemaConfigJsonField },
      },
    },
  },
};

const schemaConfigJsonVariantConsequence: JTDSchemaType<ConfigJsonVariantConsequence> = {
  optionalProperties: {
    sample_cells: {
      optionalProperties: {
        all: { elements: schemaConfigJsonField },
        snv: { elements: schemaConfigJsonField },
        str: { elements: schemaConfigJsonField },
        sv: { elements: schemaConfigJsonField },
      },
    },
  },
};

export const schema: JTDSchemaType<ConfigJson> = {
  properties: {
    vip: schemaConfigJsonVip,
    sample_variants: schemaConfigJsonVariants,
    variants: schemaConfigJsonVariants,
    sample_variant: schemaConfigJsonVariant,
    variant: schemaConfigJsonVariant,
    sample_variant_consequence: schemaConfigJsonVariantConsequence,
    variant_consequence: schemaConfigJsonVariantConsequence,
  },
};