import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterId, FilterValueId } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterId: Component<FilterProps<ConfigFilterId, FilterValueId>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "id",
    number: {
      type: "OTHER",
    },
    type: "STRING",
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
