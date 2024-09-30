import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterAlt, ConfigFilterField, FilterValueAlt } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterAlt: Component<FilterProps<ConfigFilterAlt, FilterValueAlt>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "alt",
    number: {
      type: "OTHER",
    },
    type: "STRING",
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
