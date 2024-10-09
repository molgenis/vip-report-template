import { Item } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { SampleContainer } from "../utils/sample";
import { ConfigFieldCustomBase, ConfigFieldInfo } from "./configField";

export interface ConfigFieldCustomGenotype extends ConfigFieldCustomBase {
  sample: SampleContainer;
}

export interface ConfigFieldCustomGenotypeStr extends ConfigFieldCustomBase {
  sample: SampleContainer;
}

export interface ConfigFieldCustomLocus extends ConfigFieldCustomBase {
  href: (record: Item<Record>) => string;
}

export type ConfigFieldCustomRef = ConfigFieldCustomBase;

export interface ConfigFieldCustomVipC extends ConfigFieldCustomBase {
  fieldVipC: ConfigFieldInfo;
  fieldVipP: ConfigFieldInfo;
}

export type ConfigFieldCustom =
  | ConfigFieldCustomGenotype
  | ConfigFieldCustomGenotypeStr
  | ConfigFieldCustomLocus
  | ConfigFieldCustomRef
  | ConfigFieldCustomVipC;
