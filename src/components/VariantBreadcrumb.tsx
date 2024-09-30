import { Component } from "solid-js";
import { SampleContainer } from "../Api.ts";
import { VariantType } from "../utils/variantTypeUtils.ts";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { getSampleLabel } from "../utils/sample.ts";
import { getRecordLabel, href } from "../utils/utils.ts";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb.tsx";

export const VariantBreadcrumb: Component<{
  variantType: VariantType;
  sample?: SampleContainer;
  record?: Item<Record>;
  consequenceId?: number;
}> = (props) => {
  function createBreadcrumbItems(
    variantType: VariantType,
    sample?: SampleContainer,
    record?: Item<Record>,
    consequenceId?: number,
  ) {
    const items: BreadcrumbItem[] = [];

    const tokens: (string | number)[] = [];
    if (sample) {
      tokens.push("samples");
      items.push({ href: href(tokens), text: "Samples" });
      tokens.push(sample.item.id);
      items.push({ href: href(tokens), text: getSampleLabel(sample.item) });
    }

    tokens.push("variants");
    items.push({ href: href(tokens), text: "Variants" });
    tokens.push(variantType.id);
    items.push({ href: href(tokens), text: variantType.label });

    if (record) {
      tokens.push(record.id);
      items.push({ href: href(tokens), text: getRecordLabel(record) });

      if (consequenceId) {
        tokens.push(consequenceId);
        items.push({ href: href(tokens), text: "Consequence #${consequenceId()}" });
      }
    }

    return items;
  }

  return (
    <Breadcrumb items={createBreadcrumbItems(props.variantType, props.sample, props.record, props.consequenceId)} />
  );
};
