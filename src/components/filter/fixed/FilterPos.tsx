import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterPos, FilterValuePos } from "../../../types/configFilter";
import { FieldMetadata } from "../../../../../vip-report-vcf/src/types/Metadata";
import { FilterInterval } from "../typed/FilterInterval.tsx";

export const FilterPos: Component<FilterProps<ConfigFilterPos, FilterValuePos>> = (props) => {
  const field: FieldMetadata = {
    id: "pos",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "INTEGER",
    required: true,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterInterval {...props} config={config()} />;
};
