[![Build Status](https://app.travis-ci.com/molgenis/vip-report-template.svg?branch=main)](https://app.travis-ci.com/molgenis/vip-report-template)

# vip-report-template

The default report template for the [VIP report generator](https://github.com/molgenis/vip-report). This template is a
good default for any .vcf file with support for .vcf files annotated with [VIP](https://github.com/molgenis/vip).

## Usage

```bash
$ pnpm install
$ pnpm run build # build report template in dist folder
$ pnpm run dev   # dev server on localhost:3000
```

## Config

The config.json file is used to configure which fields, filters and sort options are shown on screen.
Furthermore, it is used to pass the vip pipeline configuration to the report template.
There are 3 top level elements:

- vip: used to pass the VIP configuration
- sample_variants: to configure the sample variants screen
- variants: to configure the variants screen

Example:

```
{
  "vip": {VIP_CONFIG_HERE},
  "sample_variants": {SAMPLE_VARIANTS_SCREEN_CONFIG_HERE},
  "variants": {VARIANTS_SCREEN_CONFIG_HERE}
}
```

### VIP config

### Configuring screen content

#### Variant types

For the sample variant view multiple "subviews":

- all: which shows all types of variants
- snv: shows the single nucleotide variants and small indels.
- sv: shows structural variants
- str: shows the short tandem repeats.
  All of these screens can be configured independently, if the configuration for a specific variant type view is
  missing, the "all" configuration is used for this specific view.

Example:

```
    "cells": {
      "all": [FIELDS_CONFIG_HERE],
      "snv": [FIELDS_CONFIG_HERE],
      "sv": [FIELDS_CONFIG_HERE],
```

"str" is missing in this example, the "all" config is used for the str view.

#### Cells

This section specifies which information should be shown in the table with variant information.
Per cell the following information can/should be specified:

- "type": the type of field, one of:
    - fixed: the standard columns of an VCF file, excluding the FORMAT and INFO columns,
      one of: pos,id,ref,alt,qual,filter
    - info: a VCF INFO field
    - format: a VCF FORMAT field, currently unsupported
    - genotype: a VCF FORMAT field in the context of the current sample of the screen.
    - composed: a custom field, see the "Custom" section.
- "name": the name of the field in the VCF file
- "label": optional label, name is used if no label is specified.
- "description": optional description to be shown in the tooltip for the column on screen.

Example:

```
        {
          "type": "info",
          "name": "myInfoField"
        },
        {
          "type": "composed",
          "name": "my_composed_fieldname",
          "label": "My Composed Field Label",
          "description": "Description explaining that this is just and example field."
        },
```

##### Groups

Cells can be grouped to indicate that certain cells belong together, an example of this are the child fields of the VEP
INFO field.

Example:

```
        {
          "type": "info",
          "name": "myInfoField"
        },
        {
            "type": "group",
            "fields": [
              {
                "type": "info",
                "name": "CSQ/Consequence",
              },
              {
                "type": "info",
                "name": "CSQ/SYMBOL"
              }
            ]
        }
```

##### Custom

The following custom field are available:

- clinVar: This field shows the ClinVar values with a tooltip containing the ClinVar star rating.
- gene: The gene name with a link to https://genenames.org and an indication if the gene is associated with incomplete
  penetrance.
- genotype: Shows the genotype as genotypeSnvSv or genotypeStr (see below) based on the variant type.
- genotypeSnvSv: Shows the genotype rendering the REF and ALT nucleotides (rendered with colors per nucleotide) for the
  alleles rather than the allele numbers.
- genotypeStr: Shows the genotype as the called repeat unit in combination with the number of repeat units seen per
  allele.
- gnomAd: Shows the GnomAD allele frequency with a link to https://gnomad.broadinstitute.org, and an indicator to warn
  for low quality.
- hpo: Shows the associated HPO terms with a link to https://hpo.jax.org, the column also shows an indicator if the gene
  received a high or low confidence GADO score.
- inheritanceModes: Shows the inheritance patterns of the gene, an indicator is show if the gene is associated with the
  AR pattern and there is a possible compound AR pattern for the sample.
- locus: show chromosome:position with a link to the report variant detail view.
- ref: shows the reference nucleotide(s) (rendered with colors per nucleotide).
- vipC: shows the VIP classification with a link to the consequence details view, and the VIP classification path as
  tooltip.
- vkgl: shows the VKGL classification(s), if data for specific labs is available this is shown in the tooltip.

#### Filters

##### Custom

The following custom filters are available:

- allelicImbalance:  Filter to select variants that are/are not showing allelic imbalance.
- deNovo: Filter to select only variants that are/are not DeNovo
- hpo: Filter to select variants that match certain HPO terms
- inheritance: Filter to select variants for which the suitable inheritance patterns for the sample contain the selected
  pattern.
- locus: Filter to select variants based on their chromosome optionally within a certain position range on this
  chromosome.
- vipC: Filter on the VIP classification value stored in INFO/CSQ/VIPC, but only includes categories defined in the VIP
  configuration
  parameter vcf.filter.classes
- vipCS: Filter on the VIP sample classification value stored in FORMAT/VIPC_S, but only includes categories defined in
  the VIP configuration
  parameter vcf.filter_samples.classes

#### Sorts

Via this section available sort options and the default sort of the different views can be configured.
Currently only INFO fields with single numerical values can be used for sorting.

Multiple sort fields can be specified for a single sort option to create a secondary, tertiary, etc. sort.

Example:

```
{
  "sorts": {
    "all": [
      {
        "selected": true,
        "orders": [
          {
            "direction": "desc",
            "field": {
              "type": "info",
              "name": "MySortField"
            }
          }
        ]
      },
      {
        "selected": false,
        "orders": [
          {
            "direction": "asc",
            "field": {
              "type": "info",
              "name": "MySortOtherField"
            }
          }
        ]
      }
    ],
    "str": [
      {
        "selected": true,
        "orders": [
          {
            "direction": "desc",
            "field": {
              "type": "info",
              "name": "MySortPrimarySortField"
            }
          },
          {
            "direction": "asc",
            "field": {
              "type": "info",
              "name": "MySortSecondarySortField"
            }
          }
        ]
      },
      {
        "selected": false,
        "orders": [
          {
            "direction": "asc",
            "field": {
              "type": "info",
              "name": "MySortOtherField"
            }
          }
        ]
      }
    ]
  }
}
```

#### Records per page

Via this section available records per page options and the default can be configured.

Example:

```
"recordsPerPage": {
      "str": [
        {
          "number": 10
        },
        {
          "number": 20,
          "selected": true
        },
        {
          "number": 50
        },
        {
          "number": 100
        }
      ]
    }
```

### Wildcards

Regular expressions like can be used to include multiple fields at once in you config.

Examples:
Include all INFO fields

```
        {
          "type": "info",
          "name": ".*"
        }
```

Include all nested CSQ child fields

```
        {
          "type": "info",
          "name": "CSQ/.*"
        }
```

Include all CSQ child fields starting with a "G" and a name of 4 characters long ending with an "e" (Gene)

```
        {
          "type": "info",
          "name": "CSQ/G..e"
        }
```

## Metadata

In the metadata json file additional field metadata can be specified in addition or as replacement of the field
definition in the VCF file
This is particularly useful for nested fields like VEP, and to specify the categories of a categorical field.

Example:

```
{
  "format": {
     "MyFormatfield": {
        "label": "My Format field",
        "description": "This describes my Format field",
        "numberType": "NUMBER",
        "numberCount": 1,
        "type": "INTEGER"
    },
    "MyCategoricalFormatField": {
      "label": "My Categorical Format Field",
      "description": "This is a format categorical field.",
      "numberType": "NUMBER",
      "numberCount": 1,
      "type": "CATEGORICAL",
      "categories": {
        "1": {
          "label": "Value1",
          "description": "This is value 1"
        },
        "2": {
          "label": "Value2",
          "description": "This is value 2"
        }
      }
    }
  },
  "info": {
    "CSQ": {
      "nestedFields": {
        "MyNestedfield": {
          "label": "My nested field",
          "description": "This describes my nested field",
          "numberType": "NUMBER",
          "numberCount": 1,
          "type": "INTEGER"
        },
        "MyCategoricalNestedField": {
          "label": "My Categorical Nested Field",
          "description": "This is a nested categorical field.",
          "numberType": "NUMBER",
          "numberCount": 1,
          "type": "CATEGORICAL",
          "categories": {
            "1": {
              "label": "Value1",
              "description": "This is value 1"
            },
            "2": {
              "label": "Value2",
              "description": "This is value 2"
            }
          }
        }
      }
    },
    "MyInfofield": {
      "label": "My INFO field",
      "description": "This describes my INFO field",
      "numberType": "NUMBER",
      "numberCount": 1,
      "type": "INTEGER"
    },
    "MyCategoricalField": {
      "label": "My Categorical Field",
      "description": "This is a categorical field.",
      "numberType": "NUMBER",
      "numberCount": 1,
      "type": "CATEGORICAL",
      "categories": {
        "1": {
          "label": "Value1",
          "description": "This is value 1"
        },
        "2": {
          "label": "Value2",
          "description": "This is value 2"
        }
      }
    }
  }
}
```

### Null values

In the metadata json file "null" values can be specified for categorical fields, these values should contain a label and
optionally a description.
The label value is rendered in filters and used to display the file in tables and views if it is empty, the description
is used in tooltips.
In cases where the categorical field is of a type that can have multiple values, an array containing the null value is
returned if the field is empty.

### Example

```
"MyCategoricalField": {
  "label": "My Categorical Field",
  "description": "This is a categorical field.",
  "numberType": "NUMBER",
  "numberCount": 1,
  "type": "CATEGORICAL",
  "categories": {
    "1": {
      "label": "Value1",
      "description": "This is value 1"
    },
    "2": {
      "label": "Value2",
      "description": "This is value 2"
    }
  },
  "nullValue": {
    "label": "EmptyValue"
  }
}
```