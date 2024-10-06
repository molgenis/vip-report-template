import { VariantType } from "../utils/variantTypeUtils";
import { MetadataContainer } from "../utils/ApiUtils";
import { SampleContainer } from "../utils/sample";
import { Config } from "../types/config";
import { createConfigFilters } from "./configFilters";
import { createConfigFields } from "./configFields";

export function createConfig(
  variantType: VariantType | null,
  metadata: MetadataContainer,
  sample: SampleContainer,
): Config {
  console.log({
    filters: createConfigFilters(variantType, metadata, sample),
    fields: createConfigFields(variantType, metadata, sample),
  });
  return {
    filters: createConfigFilters(variantType, metadata, sample),
    fields: createConfigFields(variantType, metadata, sample),
  };
}
