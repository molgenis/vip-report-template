import { VariantType } from "../utils/variantTypeUtils";
import { createFieldMap, MetadataContainer } from "../utils/ApiUtils";
import { ConfigField } from "../types/field";
import { SampleContainer } from "../utils/sample";
import { createConfigFieldCustom } from "../utils/configFieldUtilsCustom";
import { createConfigFieldFormat, createConfigFieldGroup, createConfigFieldInfo } from "../utils/configFieldUtils";
import { ConfigFields } from "../types/config";

export function createConfigFields(
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
): ConfigFields {
  let fieldConfigs: ConfigFields;
  if (variantType === null) {
    fieldConfigs = createConfigFieldsDefault(metadata, sample);
  } else {
    switch (variantType.id) {
      case "snv":
        fieldConfigs = createConfigFieldsSnv(metadata, sample);
        break;
      case "str":
        fieldConfigs = createConfigFieldsStr(metadata, sample);
        break;
      case "sv":
        fieldConfigs = createConfigFieldsSv(metadata, sample);
        break;
      default:
        throw new Error(`unexpected variant type id '${variantType.id}'`);
    }
  }
  return fieldConfigs;
}

function createConfigFieldsDefault(metadata: MetadataContainer, sample: SampleContainer): ConfigFields {
  const fieldMap = createFieldMap(metadata.records); // TODO only calc once for filters and fields

  const fieldConfigs: (ConfigField | null)[] = [
    createConfigFieldCustom("custom/locus", sample),
    createConfigFieldCustom("custom/ref", sample),
    createConfigFieldCustom("custom/genotype", sample), // FIXME set 'Proband' label
    createConfigFieldGroup("genotypes", [
      sample.maternalSample ? createConfigFieldCustom("custom/genotype", sample.maternalSample) : null, // FIXME set 'Mother' label
      sample.paternalSample ? createConfigFieldCustom("custom/genotype", sample.paternalSample) : null, // FIXME set 'Father' label
      ...sample.otherPedigreeSamples.map((sample) => createConfigFieldCustom("custom/genotype", sample)),
    ]),
    createConfigFieldGroup("consequences", [
      createConfigFieldInfo("INFO/CSQ/Consequence", fieldMap),
      createConfigFieldInfo("INFO/CSQ/SYMBOL", fieldMap),
      createConfigFieldInfo("INFO/CSQ/InheritanceModesGene", fieldMap),
      createConfigFieldInfo("INFO/CSQ/HGVSc", fieldMap),
      createConfigFieldInfo("INFO/CSQ/HGVSp", fieldMap),
      createConfigFieldInfo("INFO/CSQ/CAPICE_SC", fieldMap),
      createConfigFieldInfo("INFO/CSQ/VIPC", fieldMap),
      createConfigFieldInfo("INFO/CSQ/VKGL_CL", fieldMap),
      createConfigFieldInfo("INFO/CSQ/clinVar_CLNSIG", fieldMap),
      createConfigFieldInfo("INFO/CSQ/gnomAD_AF", fieldMap),
      createConfigFieldInfo("INFO/CSQ/gnomAD_HN", fieldMap),
      createConfigFieldInfo("INFO/CSQ/PUBMED", fieldMap),
    ]),
    createConfigFieldInfo("INFO/DP", fieldMap),
    createConfigFieldFormat("FORMAT/VID", fieldMap, sample),
  ];
  return fieldConfigs.filter((fieldConfig) => fieldConfig !== null);
}

function createConfigFieldsSnv(metadata: MetadataContainer, sample: SampleContainer): ConfigFields {
  return createConfigFieldsDefault(metadata, sample); // FIXME
}

function createConfigFieldsStr(metadata: MetadataContainer, sample: SampleContainer): ConfigFields {
  return createConfigFieldsDefault(metadata, sample); // FIXME
}

function createConfigFieldsSv(metadata: MetadataContainer, sample: SampleContainer): ConfigFields {
  return createConfigFieldsDefault(metadata, sample); // FIXME
}
