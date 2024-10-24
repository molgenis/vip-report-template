import { Component } from "solid-js";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterField, ConfigFilterId, FilterValueId } from "../../../types/configFilter";
import { FieldMetadata } from "../../../../../vip-report-vcf/src/types/Metadata";
import { FilterString } from "../typed/FilterString.tsx";

export const FilterId: Component<FilterProps<ConfigFilterId, FilterValueId>> = (props) => {
  const field: FieldMetadata = {
    id: "id",
    number: {
      type: "OTHER",
    },
    type: "STRING",
  };

  const config = (): ConfigFilterField => ({ ...props.config, field });

  return <FilterString {...props} config={config()} />;
};
