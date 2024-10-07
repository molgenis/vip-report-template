import { FieldId } from "../types/configField";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { getSampleLabel, SampleContainer } from "./sample";
import {
  ConfigFieldCustom,
  ConfigFieldCustomGenotype,
  ConfigFieldCustomLocus,
  ConfigFieldCustomRef,
} from "../types/configFieldCustom";

export function createConfigFieldCustom(id: FieldId, sample: SampleContainer): ConfigFieldCustom {
  let fieldConfig: ConfigFieldCustom;
  switch (id) {
    case "genotype":
      fieldConfig = createConfigFieldCustomGenotype(sample);
      break;
    case "locus":
      fieldConfig = createConfigFieldCustomLocus(sample);
      break;
    case "ref":
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
    id: "genotype",
    label: getSampleLabel(sample.item.data),
    sample: sample,
  };
}

function createConfigFieldCustomLocus(sample: SampleContainer): ConfigFieldCustomLocus {
  return {
    type: "custom",
    id: "locus",
    label: "Position",
    href: (record: Item<Record>) => `/samples/${sample.item.id}/variant/${record.id}`,
  };
}

function createConfigFieldCustomRef(): ConfigFieldCustomRef {
  return {
    type: "custom",
    id: "ref",
    label: "Reference",
  };
}
