import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterRef, FilterValueRef } from "../../../types/configFilter";
import { FilterString } from "../typed/FilterString.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterRef: Component<FilterProps<ConfigFilterRef, FilterValueRef>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "ref",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "STRING",
    required: true,
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
