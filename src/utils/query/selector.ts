import { FieldMetadata } from "@molgenis/vip-report-vcf";
import { Selector, SelectorPart, SortPath } from "@molgenis/vip-report-api";
import { FieldMetadataWrapper } from "../vcf.ts";
import { SampleContainer } from "../api.ts";

export function createSelectorInfo(field: FieldMetadataWrapper): SelectorPart[] {
  return ["n", ...selector(field)];
}

export function createSelectorSample(sample: SampleContainer, field: FieldMetadataWrapper): SelectorPart[] {
  return ["s", sample.item.data.index, ...selector(field)];
}

export function createInfoSortPath(field: FieldMetadata): SortPath {
  return ["n", ...selector(field).filter((part) => part !== "*")];
}

function selector(field: FieldMetadata): SelectorPart[] {
  const selector: Selector = [];
  let currentField: FieldMetadata | undefined = field;
  do {
    if (currentField.parent && currentField.parent.nested) {
      const items = currentField.parent.nested.items;
      let i;
      for (i = 0; i < items.length; ++i) {
        if (items[i]!.id === currentField.id) {
          break;
        }
      }
      selector.push(i);
      if (currentField.parent.number.count !== 1) {
        selector.push("*");
      }
    } else {
      selector.push(currentField.id);
    }
    currentField = currentField.parent;
  } while (currentField);
  selector.reverse();
  return selector;
}
