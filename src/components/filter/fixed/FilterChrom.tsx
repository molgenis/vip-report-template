import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterChrom, ConfigFilterField, FilterValueChrom } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

export const FilterChrom: Component<FilterProps<ConfigFilterChrom, FilterValueChrom>> = (props) => {
  const field: FieldMetadata = {
    id: "chrom",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "STRING",
    required: true,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
