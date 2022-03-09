import { InfoMetadata, NestedInfoMetadata, NumberMetadata, NumberType, ValueType } from "./MetadataParser";

const REG_EXP_VEP = /Consequence annotations from Ensembl VEP. Format: (.+)/;

export function isVepInfoMetadata(infoMetadata: InfoMetadata): boolean {
  return REG_EXP_VEP.test(infoMetadata.description);
}

export function createVepInfoMetadata(infoMetadata: InfoMetadata): NestedInfoMetadata {
  return {
    separator: "|",
    items: parseVepInfoMetadataArray(infoMetadata.description),
  };
}

function parseVepInfoMetadataArray(token: string): InfoMetadata[] {
  const result = token.match(REG_EXP_VEP);
  if (result === null) {
    throw new Error(`invalid vep info metadata '${token}'`);
  }

  const tokens = result[1].split("|");
  return tokens.map((part) => parseVepInfoMetadata(part));
}

function parseVepInfoMetadata(token: string): InfoMetadata {
  let numberType: NumberType;
  let numberCount;
  let separator;
  let type: ValueType;

  switch (token) {
    case "Consequence":
    case "Existing_variation":
    case "CLIN_SIG":
    case "FLAGS":
    case "HPO":
    case "InheritanceModesGene":
      numberType = "OTHER";
      separator = "&";
      type = "STRING";
      break;
    case "PHENO":
    case "PUBMED":
    case "SOMATIC":
      numberType = "OTHER";
      separator = "&";
      type = "INTEGER";
      break;
    case "STRAND":
      numberType = "NUMBER";
      numberCount = 1;
      type = "INTEGER";
      break;
    case "gnomAD_AF":
    case "gnomAD_AFR_AF":
    case "gnomAD_AMR_AF":
    case "gnomAD_ASJ_AF":
    case "gnomAD_EAS_AF":
    case "gnomAD_FIN_AF":
    case "gnomAD_NFE_AF":
    case "gnomAD_OTH_AF":
    case "gnomAD_SAS_AF":
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
  };
}
