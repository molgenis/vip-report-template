import { Component } from "solid-js";
import { FilterTyped, FilterTypedProps } from "../typed/FilterTyped.tsx";

export type FilterHpoProps = FilterTypedProps;

export const FilterHpo: Component<FilterHpoProps> = (props) => {
  return <FilterTyped {...props} />;
};
