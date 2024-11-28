import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterFilter, FilterValueFilter } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterFilter: Component<FilterProps<ConfigFilterFilter, FilterValueFilter>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "filter",
    number: {
      type: "OTHER",
    },
    type: "STRING",
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
