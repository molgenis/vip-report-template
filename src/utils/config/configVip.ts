import { ConfigJsonVip, ConfigVip } from "../../types/config";
import { MetadataContainer } from "../api.ts";
import { getSampleField } from "../vcf.ts";
import { ConfigInvalidPropertyValueError } from "../error.ts";

export function initConfigVip(config: ConfigJsonVip, metadata: MetadataContainer): ConfigVip {
  const filterField = config.filter_field;
  const fieldMetadata = getSampleField(metadata.records, filterField.name);

  if (fieldMetadata && fieldMetadata.type !== "CATEGORICAL") {
    throw new ConfigInvalidPropertyValueError(
      "vip.filter_field.name",
      filterField.name,
      `is of type ${fieldMetadata.type} instead of CATEGORICAL`,
    );
  }

  return { filter_field: fieldMetadata || null, params: config.params };
}
