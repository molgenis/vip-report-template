import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterFilter, FilterValueFilter } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

export const FilterFilter: Component<FilterProps<ConfigFilterFilter, FilterValueFilter>> = (props) => {
  const field: FieldMetadata = {
    id: "filter",
    number: {
      type: "OTHER",
    },
    type: "STRING",
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
