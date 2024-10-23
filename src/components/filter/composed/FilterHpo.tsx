import { Component } from "solid-js";
import { FilterTyped } from "../typed/FilterTyped.tsx";
import { FilterProps } from "../Filter.tsx";
import { ConfigFilterHpo, FilterValueHpo } from "../../../types/configFilterComposed";

export const FilterHpo: Component<FilterProps<ConfigFilterHpo, FilterValueHpo>> = (props) => {
  return <FilterTyped {...props} />;
};
