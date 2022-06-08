import { hashIntegration, Router } from "solid-app-router";
import { ParentComponent } from "solid-js";

export const Provider: ParentComponent = (props) => {
  return <Router source={hashIntegration()}>{props.children}</Router>;
};
