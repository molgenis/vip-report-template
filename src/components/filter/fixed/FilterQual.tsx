import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterQual, FilterValueQual } from "../../../types/configFilter";
import { FilterInterval } from "../typed/FilterInterval.tsx";
import { FieldMetadataWrapper } from "../../../utils/vcf.ts";

export const FilterQual: Component<FilterProps<ConfigFilterQual, FilterValueQual>> = (props) => {
  const field: FieldMetadataWrapper = {
    id: "qual",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "FLOAT",
    index: 0,
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterInterval {...props} config={config()} />;
};
