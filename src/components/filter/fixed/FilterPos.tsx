import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterPos, FilterValuePos } from "../../../types/configFilter";
import { FilterInterval } from "../typed/FilterInterval.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterPos: Component<FilterProps<ConfigFilterPos, FilterValuePos>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "pos",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "INTEGER",
    required: true,
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterInterval {...props} config={config()} />;
};
