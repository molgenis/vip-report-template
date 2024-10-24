import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterRef, FilterValueRef } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadata } from "../../../../../vip-report-vcf/src/types/Metadata";

export const FilterRef: Component<FilterProps<ConfigFilterRef, FilterValueRef>> = (props) => {
  const field: FieldMetadata = {
    id: "ref",
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
