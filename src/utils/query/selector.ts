import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { Selector, SelectorPart, SortPath } from "@molgenis/vip-report-api";
import { FieldMetadataWrapper } from "../vcf.ts";
import { SampleContainer } from "../api.ts";

export function createSelectorInfo(field: FieldMetadataWrapper): SelectorPart[] {
  return ["n", ...selector(field)];
}

export function createSelectorSample(sample: SampleContainer, field: FieldMetadataWrapper): SelectorPart[] {
  return ["s", sample.item.data.id, ...selector(field)];
}

export function createInfoSortPath(field: FieldMetadata): SortPath {
  return ["n", ...selector(field).filter((part) => part !== "*")];
}

function selector(field: FieldMetadata): SelectorPart[] {
  const selector: Selector = [];
  const currentField: FieldMetadata | undefined = field;
  if (currentField.parent) {
    selector.push(currentField.parent.id);
  }
  selector.push(currentField.id);
  return selector;
}
