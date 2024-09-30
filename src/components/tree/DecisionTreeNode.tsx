import { Component, createSignal, Match, Show, Signal, Switch } from "solid-js";
import { BoolMultiNode, BoolNode, CategoricalNode, ExistsNode, LeafNode, Node } from "@molgenis/vip-report-api/src/Api";
import { ErrorNotification } from "../ErrorNotification";
import { DecisionTreeNodeBool } from "./DecisionTreeNodeBool";
import { DecisionTreeNodeBoolMulti } from "./DecisionTreeNodeBoolMulti";
import { DecisionTreeNodeCategorical } from "./DecisionTreeNodeCategorical";
import { DecisionTreeNodeExists } from "./DecisionTreeNodeExists";
import { DecisionTreeNodeLeaf } from "./DecisionTreeNodeLeaf";

export const DecisionTreeNode: Component<{ nodeId: string; node: Node }> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(true);

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  return (
    <Show
      when={props.node !== undefined}
      fallback={
        <div class="notification is-danger is-light">
          Error: Unknown node "{props.nodeId}". (Possible mismatch between VCF file and provided decision tree.)
        </div>
      }
    >
      <div classList={{ card: true, "has-background-success": props.node.type === "LEAF" }}>
        <header class="card-header">
          <p class="card-header-title">
            <span>{props.nodeId}</span>
            {props.node.description && <span class="ml-1">({props.node.description})</span>}
          </p>
          <button class="card-header-icon" aria-label="more options" onClick={toggleCollapse}>
            <span class="icon">
              <i classList={{ fas: true, "fa-angle-down": collapsed(), "fa-angle-up": !collapsed() }} />
            </span>
          </button>
        </header>
        {!collapsed() && (
          <div class="card-content">
            <div class="content">
              <Switch fallback={<ErrorNotification error={`invalid node type ${props.node.type}`} />}>
                <Match when={props.node.type === "BOOL"}>
                  <DecisionTreeNodeBool node={props.node as BoolNode} />
                </Match>
                <Match when={props.node.type === "BOOL_MULTI"}>
                  <DecisionTreeNodeBoolMulti node={props.node as BoolMultiNode} />
                </Match>
                <Match when={props.node.type === "CATEGORICAL"}>
                  <DecisionTreeNodeCategorical node={props.node as CategoricalNode} />
                </Match>
                <Match when={props.node.type === "EXISTS"}>
                  <DecisionTreeNodeExists node={props.node as ExistsNode} />
                </Match>
                <Match when={props.node.type === "LEAF"}>
                  <DecisionTreeNodeLeaf node={props.node as LeafNode} />
                </Match>
              </Switch>
            </div>
          </div>
        )}
      </div>
    </Show>
  );
};
