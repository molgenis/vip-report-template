import { Component, For, Show } from "solid-js";
import { createAsync, RouteSectionProps } from "@solidjs/router";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { VariantTable } from "../components/VariantTable";
import { VariantInfoTable } from "../components/VariantInfoTable";
import { VariantInfoNestedTable } from "../components/VariantInfoNestedTable";
import { getNestedInfoFieldsWithValues } from "../utils/field";
import { Breadcrumb } from "../components/Breadcrumb";
import { getMetadata, getRecordById } from "./data/data";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { parseVariantType, VariantType } from "../utils/variantTypeUtils";

import { getRecordLabel } from "../utils/utils.ts";

export const Variant: Component<RouteSectionProps<Promise<Item<Record>>>> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);

  const metadata = createAsync(() => getMetadata());
  const variant = createAsync(() => getRecordById(props.params.variantId));

  function createBreadcrumbItems(variant: Item<Record>, variantType: VariantType) {
    return [{ href: `/variants/${variantType.id}`, text: "Variants" }, { text: getRecordLabel(variant) }];
  }

  return (
    <>
      <Show when={metadata()} fallback={<Loader />}>
        {(metadata) => (
          <Show when={variant()} fallback={<Loader />}>
            {(variant) => (
              <>
                <Breadcrumb items={createBreadcrumbItems(variant(), variantType())} />
                <GenomeBrowser contig={variant().data.c} position={variant().data.p} samples={[]} />
                <div class="columns">
                  <div class="column is-3">
                    <h1 class="title is-5">Record</h1>
                    <VariantTable variant={variant().data} />
                  </div>
                  <Show
                    when={
                      Object.values(metadata().records.info).filter(
                        (info) => !info.nested && variant().data.n[info.id] !== undefined,
                      ).length > 0
                    }
                  >
                    <div class="column is-3">
                      <h1 class="title is-5">Info</h1>
                      <VariantInfoTable infoFields={metadata().records.info} record={variant()} />
                    </div>
                  </Show>
                </div>
                <div class="columns">
                  <div class="column" style={{ "max-width": "100%" }}>
                    <For each={getNestedInfoFieldsWithValues(metadata().records.info, variant().data.n)}>
                      {(infoField) => (
                        <>
                          <h1 class="title is-5">{infoField.id}</h1>
                          <p class="mb-4">{infoField.description}</p>
                          <VariantInfoNestedTable
                            infoValue={variant().data.n[infoField.id] as unknown as Value[][]}
                            infoField={infoField}
                            record={variant()}
                            sample={null}
                          />
                        </>
                      )}
                    </For>
                  </div>
                </div>
              </>
            )}
          </Show>
        )}
      </Show>
    </>
  );
};
