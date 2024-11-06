import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterAlt, ConfigFilterField, FilterValueAlt } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadata } from "@molgenis/vip-report-vcf";

export const FilterAlt: Component<FilterProps<ConfigFilterAlt, FilterValueAlt>> = (props) => {
  const field: FieldMetadata = {
    id: "alt",
    number: {
      type: "OTHER",
    },
    type: "STRING",
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
