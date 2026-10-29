import { Component, createSignal, For, Show } from "solid-js";
import { DecisionTree, Node } from "@molgenis/vip-report-api";
import { DecisionTreeNode } from "./DecisionTreeNode";
import { describeCondition, describeOutcome } from "../../utils/decisionTreeOutcome.ts";

export type DecisionTreePath = string[];

// One step of the path: the question asked, the answer that led to the next step, and the rule on demand.
const DecisionTreeStep: Component<{ nodeId: string; node: Node | undefined; nextNodeId: string | undefined }> = (
  props,
) => {
  const [showRule, setShowRule] = createSignal(false);
  const condition = () => (props.node ? describeCondition(props.node) : null);
  const outcome = () =>
    props.node && props.nextNodeId !== undefined ? describeOutcome(props.node, props.nextNodeId) : null;

  return (
    <li class="decision-flow-step">
      <Show
        when={props.node}
        fallback={
          <div class="notification is-danger is-light">
            Error: Unknown node "{props.nodeId}". (Possible mismatch between VCF file and provided decision tree.)
          </div>
        }
      >
        {(node) => (
          <>
            <div class="decision-flow-title">{node().label}</div>
            <Show when={node().description}>
              <div class="decision-flow-description">{node().description}</div>
            </Show>
            <div class="decision-flow-answer">
              <Show when={condition()}>{(condition) => <code>{condition()}</code>}</Show>
              <Show when={outcome()}>{(outcome) => <span class="decision-flow-outcome">{outcome()}</span>}</Show>
              <button type="button" class="decision-flow-rule-toggle" onClick={() => setShowRule((show) => !show)}>
                {showRule() ? "Hide rule" : "Show rule"}
              </button>
            </div>
            <Show when={showRule()}>
              <div class="decision-flow-rule">
                <DecisionTreeNode nodeId={props.nodeId} node={node()} expanded={true} />
              </div>
            </Show>
          </>
        )}
      </Show>
    </li>
  );
};

export const DecisionTreePath: Component<{
  decisionTree: DecisionTree;
  path: DecisionTreePath;
}> = (props) => {
  const steps = () => props.path.filter((nodeId) => props.decisionTree.nodes[nodeId]?.type !== "LEAF");
  const leaf = () => {
    const lastId = props.path[props.path.length - 1];
    const node = lastId !== undefined ? props.decisionTree.nodes[lastId] : undefined;
    return node?.type === "LEAF" ? node : null;
  };

  return (
    <ol class="decision-flow">
      <For each={steps()}>
        {(nodeId) => (
          <DecisionTreeStep
            nodeId={nodeId}
            node={props.decisionTree.nodes[nodeId]}
            nextNodeId={props.path[props.path.indexOf(nodeId) + 1]}
          />
        )}
      </For>
      <Show when={leaf()}>
        {(leaf) => (
          <li class="decision-flow-step is-leaf">
            <div class="decision-flow-title">{leaf().label}</div>
            <Show when={leaf().description}>
              <div class="decision-flow-description">{leaf().description}</div>
            </Show>
          </li>
        )}
      </Show>
    </ol>
  );
};
