import { Component, createResource, Show } from "solid-js";
import api from "../Api";
import { Loader } from "../components/Loader";

const fetchDecisionTree = async () => await api.getDecisionTree();

export const DecisionTree: Component = () => {
  const [decisionTree] = createResource(fetchDecisionTree);

  return (
    <Show when={!decisionTree.loading} fallback={<Loader />}>
      <span>{new TextDecoder("utf-8").decode(decisionTree())}</span>
    </Show>
  );
};
