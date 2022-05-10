import { InfoMetadata, NestedFieldMetadata, NumberMetadata, NumberType, ValueType } from "./MetadataParser";

const REG_EXP_VEP = /Consequence annotations from Ensembl VEP. Format: (.+)/;

export function isVepInfoMetadata(infoMetadata: InfoMetadata): boolean {
  return REG_EXP_VEP.test(infoMetadata.description);
}

export function createVepInfoMetadata(infoMetadata: InfoMetadata): NestedFieldMetadata {
  return {
    separator: "|",
    items: parseVepInfoMetadataArray(infoMetadata),
  };
}

function parseVepInfoMetadataArray(infoMetadata: InfoMetadata): InfoMetadata[] {
  const token = infoMetadata.description;
  const result = token.match(REG_EXP_VEP);
  if (result === null) {
    throw new Error(`invalid vep info metadata '${token}'`);
  }

  const tokens = result[1].split("|");
  return tokens.map((part) => parseVepInfoMetadata(infoMetadata, part));
}

function parseVepInfoMetadata(infoMetadata: InfoMetadata, token: string): InfoMetadata {
  let numberType: NumberType;
  let numberCount;
  let separator;
  let type: ValueType;
  let categories: string[] | undefined;
  let required = false;

  switch (token) {
    case "Consequence":
    case "Existing_variation":
    case "CLIN_SIG":
    case "FLAGS":
    case "HPO":
    case "InheritanceModesGene":
    case "VIPP":
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "CAPICE_CL":
    case "VKGL_CL":
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["B", "LB", "VUS", "LP", "P"];
      break;
    case "Feature_type":
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["Transcript", "RegulatoryFeature", "MotifFeature"];
      required = true;
      break;
    case "IMPACT":
      numberType = "NUMBER";
      numberCount = 1;
      type = "CATEGORICAL";
      categories = ["LOW", "MODERATE", "HIGH", "MODIFIER"];
      required = true;
      break;
    case "PHENO":
    case "PUBMED":
    case "SOMATIC":
      numberType = "OTHER";
      separator = "&";
      type = "INTEGER";
      break;
    case "gnomAD_HN":
    case "STRAND":
      numberType = "NUMBER";
      numberCount = 1;
      type = "INTEGER";
      break;
    case "CAPICE_SC":
    case "gnomAD_AF":
    case "gnomAD_AFR_AF":
    case "gnomAD_AMR_AF":
    case "gnomAD_ASJ_AF":
    case "gnomAD_EAS_AF":
    case "gnomAD_FIN_AF":
    case "gnomAD_NFE_AF":
    case "gnomAD_OTH_AF":
    case "gnomAD_SAS_AF":
    case "PolyPhen":
    case "SIFT":
      numberType = "NUMBER";
      numberCount = 1;
      type = "FLOAT";
      break;
    default:
      numberType = "NUMBER";
      numberCount = 1;
      type = "STRING";
      break;
  }

  const numberMetadata: NumberMetadata = { type: numberType };
  if (numberCount) {
    numberMetadata.count = numberCount;
  }
  if (separator) {
    numberMetadata.separator = separator;
  }
  return {
    id: token,
    number: numberMetadata,
    type,
    description: token,
    categories: categories,
    parent: infoMetadata,
    required,
  };
}
