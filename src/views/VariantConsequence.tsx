import { Component, createResource, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { Loader } from "../components/Loader";
import { DecisionTree } from "@molgenis/vip-report-api/src/Api";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { Breadcrumb } from "../components/Breadcrumb";
import { getSpecificConsequence } from "../utils/viewUtils";
import { ConsequenceTable } from "../components/ConsequenceTable";
import { DecisionTreePath } from "../components/tree/DecisionTreePath";
import { getDecisionTreePath } from "../utils/decisionTreeUtils";
import {
  EMPTY_DECISION_TREE,
  EMPTY_RECORDS_METADATA,
  fetchDecisionTree,
  fetchRecordsMeta,
  getRecordLabel,
} from "../utils/ApiUtils";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { getVariant } from "./data/data";

export const VariantConsequence: Component<RouteSectionProps> = (props) => {
  const variant = createAsync(() => getVariant(Number(props.params.variantId)));
  const consequenceId = () => Number(props.params.consequenceId);

  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [decisionTree] = createResource(fetchDecisionTree, { initialValue: EMPTY_DECISION_TREE });

  const csqFields = (): FieldMetadata[] => recordsMetadata().info.CSQ?.nested?.items || [];

  const hasDecisionTreePathMeta = () => csqFields().findIndex((csq) => csq.id === "VIPP") !== -1;
  return (
    <Show when={variant()} fallback={<Loader />} keyed>
      {(variant) => (
        <>
          <Breadcrumb
            items={[
              { href: "/variants", text: "Variants" },
              { href: `/variants/${variant.id}`, text: getRecordLabel(variant) },
              { text: `Consequence #${consequenceId()}` },
            ]}
          />
          <div class="columns">
            <div class="column is-6">
              <h1 class="title is-5">Consequence</h1>
              <ConsequenceTable
                csqMetadata={csqFields()}
                csqValues={getSpecificConsequence(variant.data.n.CSQ as ValueArray, consequenceId())}
                record={variant}
              />
            </div>
            {hasDecisionTreePathMeta() && (
              <Show when={!recordsMetadata.loading && !decisionTree.loading && (decisionTree() as DecisionTree)} keyed>
                {(decisionTree) => (
                  <div class="column">
                    <h1 class="title is-5">Classification tree path</h1>
                    <DecisionTreePath
                      decisionTree={decisionTree}
                      path={getDecisionTreePath(recordsMetadata(), variant, consequenceId())}
                    />
                  </div>
                )}
              </Show>
            )}
          </div>
          <div class="columns">
            <div class="column is-6">
              <h1 class="title is-5">Record</h1>
              <VariantTable variant={variant.data} />
            </div>
            <div class="column">
              <h1 class="title is-5">Info</h1>
              <VariantInfoTable infoFields={recordsMetadata().info} record={variant} />
            </div>
          </div>
        </>
      )}
    </Show>
  );
};
