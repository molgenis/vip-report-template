import { Component, createResource } from "solid-js";
import api from "../Api";

const fetchDecisionTree = async () => await api.getDecisionTree();

export const DecisionTree: Component = () => {
  const [decisionTree] = createResource(fetchDecisionTree);
  return <>{!decisionTree.loading && <span>{new TextDecoder("utf-8").decode(decisionTree())}</span>}</>;
};
