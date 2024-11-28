import { Component, createSignal, Match, Show, Signal, Switch } from "solid-js";
import { BoolMultiNode, BoolNode, CategoricalNode, ExistsNode, LeafNode, Node } from "@molgenis/vip-report-api";
import { ErrorNotification } from "../ErrorNotification";
import { DecisionTreeNodeBool } from "./DecisionTreeNodeBool";
import { DecisionTreeNodeBoolMulti } from "./DecisionTreeNodeBoolMulti";
import { DecisionTreeNodeCategorical } from "./DecisionTreeNodeCategorical";
import { DecisionTreeNodeExists } from "./DecisionTreeNodeExists";
import { DecisionTreeNodeLeaf } from "./DecisionTreeNodeLeaf";

export const DecisionTreeNode: Component<{ nodeId: string; node: Node | undefined }> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(true);

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  return (
    <Show
      when={props.node}
      fallback={
        <div class="notification is-danger is-light">
          Error: Unknown node "{props.nodeId}". (Possible mismatch between VCF file and provided decision tree.)
        </div>
      }
    >
      {(node) => (
        <div classList={{ card: true, "has-background-success": node().type === "LEAF" }}>
          <header class="card-header">
            <p class="card-header-title">
              <span>{node().label}</span>
              {node().description && <span class="ml-1">({node().description})</span>}
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
                <Switch fallback={<ErrorNotification error={`invalid node type ${node().type}`} />}>
                  <Match when={node().type === "BOOL"}>
                    <DecisionTreeNodeBool node={node() as BoolNode} />
                  </Match>
                  <Match when={node().type === "BOOL_MULTI"}>
                    <DecisionTreeNodeBoolMulti node={node() as BoolMultiNode} />
                  </Match>
                  <Match when={node().type === "CATEGORICAL"}>
                    <DecisionTreeNodeCategorical node={node() as CategoricalNode} />
                  </Match>
                  <Match when={node().type === "EXISTS"}>
                    <DecisionTreeNodeExists node={node() as ExistsNode} />
                  </Match>
                  <Match when={node().type === "LEAF"}>
                    <DecisionTreeNodeLeaf node={node() as LeafNode} />
                  </Match>
                </Switch>
              </div>
            </div>
          )}
        </div>
      )}
    </Show>
  );
};
