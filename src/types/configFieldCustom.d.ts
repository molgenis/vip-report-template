import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { SampleContainer } from "../utils/sample";
import { ConfigFieldCustomBase } from "./configField";

export interface ConfigFieldCustomLocus extends ConfigFieldCustomBase {
  href: (record: Item<Record>) => string;
}

export type ConfigFieldCustomRef = ConfigFieldCustomBase;

export interface ConfigFieldCustomGenotype extends ConfigFieldCustomBase {
  sample: SampleContainer;
}

export type ConfigFieldCustom = ConfigFieldCustomLocus | ConfigFieldCustomRef | ConfigFieldCustomGenotype;
