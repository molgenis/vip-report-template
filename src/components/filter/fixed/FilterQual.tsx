import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterQual, FilterValueQual } from "../../../types/configFilter";
import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { FilterInterval } from "../typed/FilterInterval.tsx";

export const FilterQual: Component<FilterProps<ConfigFilterQual, FilterValueQual>> = (props) => {
  const field: FieldMetadata = {
    id: "qual",
    number: {
      type: "NUMBER",
      count: 1,
    },
    type: "FLOAT",
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterInterval {...props} config={config()} />;
};
