import { Component, createResource, Resource, Show } from "solid-js";
import { useRouteData } from "solid-app-router";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Loader } from "../components/Loader";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
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
  toString,
} from "../utils/ApiUtils";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";

export const VariantConsequence: Component = () => {
  const {
    variant,
    consequenceId,
  }: { sample: Resource<Item<Sample>>; variant: Resource<Item<Record>>; consequenceId: number } = useRouteData();

  const [recordsMetadata] = createResource(fetchRecordsMeta, { initialValue: EMPTY_RECORDS_METADATA });
  const [decisionTree] = createResource(fetchDecisionTree, { initialValue: EMPTY_DECISION_TREE });

  const csqFields = (): FieldMetadata[] => recordsMetadata().info.CSQ?.nested?.items || [];
  const csqValues = (): ValueArray => getSpecificConsequence(variant().data.n.CSQ as ValueArray, consequenceId);
  return (
    <Show when={!variant.loading} fallback={<Loader />}>
      <Breadcrumb
        items={[
          { href: "/variants", text: "Variants" },
          { href: `/variants/${variant().id}`, text: toString(variant()) },
          { text: `Consequence #${consequenceId}` },
        ]}
      />
      <div class="columns">
        <div class="column is-6">
          <h1 class="title is-5">Consequence</h1>
          <ConsequenceTable
            csqMetadata={csqFields()}
            csqValues={csqValues()}
            record={variant().data}
          ></ConsequenceTable>
        </div>
        <Show when={decisionTree()}>
          {(decisionTree) => (
            <div class="column">
              <h1 class="title is-5">Classification tree path</h1>
              <DecisionTreePath
                decisionTree={decisionTree}
                path={getDecisionTreePath(recordsMetadata(), variant(), consequenceId)}
              />
            </div>
          )}
        </Show>
      </div>
      <div class="columns">
        <div class="column is-6">
          <h1 class="title is-5">Record</h1>
          <VariantTable variant={variant().data} />
        </div>
        <div class="column">
          <h1 class="title is-5">Info</h1>
          <VariantInfoTable infoValues={variant().data.n} infoFields={recordsMetadata().info} />
        </div>
      </div>
    </Show>
  );
};
