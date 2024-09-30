import { Component, createResource, Show } from "solid-js";
import { Breadcrumb, BreadCrumbItem } from "../components/Breadcrumb";
import { composeMetadata, fetchHtsFileMetadata, fetchRecordsMeta, fetchVariantTypeIds } from "../utils/ApiUtils";
import { Loader } from "../components/Loader";
import { parseVariantType, VariantType, VariantTypeId } from "../utils/variantTypeUtils";
import { RouteSectionProps } from "@solidjs/router";
import { VariantsContainer } from "../components/VariantsContainer";

export const VariantsTyped: Component<RouteSectionProps> = (props) => {
  const variantType = () => parseVariantType(props.params.variantType);
  const [variantTypeIds] = createResource(fetchVariantTypeIds);
  const [recordsMeta] = createResource(fetchRecordsMeta);
  const [htsFileMeta] = createResource(fetchHtsFileMetadata);

  function createBreadCrumbItems(variantType: VariantType, variantTypeIds: Set<VariantTypeId>): BreadCrumbItem[] {
    const items: BreadCrumbItem[] = [];
    if (variantTypeIds.size > 1) {
      items.push({ href: "/variants", text: "Variants" });
      items.push({ text: variantType.label });
    } else {
      items.push({ text: "Variants" });
    }
    return items;
  }

  return (
    <Show when={variantTypeIds()} fallback={<Loader />}>
      {(variantTypeIds) => (
        <>
          <Breadcrumb items={createBreadCrumbItems(variantType(), variantTypeIds())} />
          <Show when={recordsMeta()} fallback={<Loader />}>
            {(recordsMeta) => (
              <Show when={htsFileMeta()} fallback={<Loader />}>
                {(htsFileMeta) => (
                  <VariantsContainer
                    metadata={composeMetadata(htsFileMeta(), recordsMeta())}
                    variantType={variantType()}
                    variantTypeIds={variantTypeIds()}
                    sample={null}
                  />
                )}
              </Show>
            )}
          </Show>
        </>
      )}
    </Show>
  );
};
