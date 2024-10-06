import { FieldId } from "../types/field";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { getSampleLabel, SampleContainer } from "./sample";
import {
  ConfigFieldCustom,
  ConfigFieldCustomGenotype,
  ConfigFieldCustomLocus,
  ConfigFieldCustomRef,
} from "../types/fieldCustom";

export function createConfigFieldCustom(id: FieldId, sample: SampleContainer): ConfigFieldCustom {
  let fieldConfig: ConfigFieldCustom;
  switch (id) {
    case "custom/genotype":
      fieldConfig = createConfigFieldCustomGenotype(sample);
      break;
    case "custom/locus":
      fieldConfig = createConfigFieldCustomLocus(sample);
      break;
    case "custom/ref":
      fieldConfig = createConfigFieldCustomRef();
      break;
    default:
      throw new Error(`unexpected custom field id '${id}'`);
  }
  return fieldConfig;
}

function createConfigFieldCustomGenotype(sample: SampleContainer): ConfigFieldCustomGenotype {
  return {
    type: "custom",
    id: "custom/genotype",
    label: getSampleLabel(sample.item.data),
    sample: sample,
  };
}

function createConfigFieldCustomLocus(sample: SampleContainer): ConfigFieldCustomLocus {
  return {
    type: "custom",
    id: "custom/locus",
    label: "Position",
    href: (record: Item<Record>) => `/samples/${sample.item.id}/variant/${record.id}`,
  };
}

function createConfigFieldCustomRef(): ConfigFieldCustomRef {
  return {
    type: "custom",
    id: "custom/ref",
    label: "Reference",
  };
}
