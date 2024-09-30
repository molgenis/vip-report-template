import { FieldMetadata, InfoMetadata } from "@molgenis/vip-report-vcf/src/types/Metadata";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { Value } from "@molgenis/vip-report-vcf/src/ValueParser";
import { CellValueCustom } from "./configCellComposed";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { RecordSampleType } from "@molgenis/vip-report-vcf/src/SampleDataParser";

export type CellId = string;
export type CellType =
  | "chrom"
  | "pos"
  | "id"
  | "ref"
  | "alt"
  | "qual"
  | "filter"
  | "info"
  | "format"
  | "genotype"
  | "composed";
export type FieldIndex = number;

export type RecordContext = { valueIndex?: number };

interface ConfigCellBase<T extends CellValue> {
  type: CellType;
  value: (record: Item<Record>, recordContext: RecordContext) => T;
  valueCount: (record: Item<Record>) => number;
}

export type CellValueChrom = string;

export interface ConfigCellChrom extends ConfigCellBase<CellValueChrom> {
  type: "chrom";
}

export type CellValuePos = number;

export interface ConfigCellPos extends ConfigCellBase<CellValuePos> {
  type: "pos";
}

export type CellValueId = string[];

export interface ConfigCellId extends ConfigCellBase<CellValueId> {
  type: "id";
}

export type CellValueRef = string;

export interface ConfigCellRef extends ConfigCellBase<CellValueRef> {
  type: "ref";
}

export type CellValueAlt = (string | null)[];

export interface ConfigCellAlt extends ConfigCellBase<CellValueAlt> {
  type: "alt";
}

export type CellValueQual = number | null;

export interface ConfigCellQual extends ConfigCellBase<CellValueQual> {
  type: "qual";
}

export type CellValueFilter = string[];

export interface ConfigCellFilter extends ConfigCellBase<string[]> {
  type: "filter";
}

export type CellValueInfo = Value | undefined;

export interface ConfigCellInfo extends ConfigCellBase<CellValueInfo> {
  type: "info";
  field: InfoMetadata;
}

export type CellValueFormat = string[];

export interface ConfigCellFormat extends ConfigCellBase<CellValueFormat> {
  type: "format";
}

export type CellValueGenotype = RecordSampleType;

export interface ConfigCellGenotype extends ConfigCellBase<CellValueGenotype> {
  type: "genotype";
  field: FieldMetadata;
}

interface ConfigCellCustom<T extends CellValueCustom> extends ConfigCellBase<T> {
  type: "composed";
  id: CellId;
  label: string;
  description?: string;
}

export type ConfigCellItem =
  | ConfigCellChrom
  | ConfigCellPos
  | ConfigCellId
  | ConfigCellRef
  | ConfigCellAlt
  | ConfigCellQual
  | ConfigCellFilter
  | ConfigCellFormat
  | ConfigCellInfo
  | ConfigCellGenotype
  | ConfigCellCustom<CellValueCustom>;

export interface ConfigCellGroup {
  type: "group";
  fieldConfigs: ConfigCellItem[];
}

export type ConfigCell = ConfigCellItem | ConfigCellGroup;

export type CellValue =
  | CellValueChrom
  | CellValuePos
  | CellValueId
  | CellValueRef
  | CellValueAlt
  | CellValueQual
  | CellValueFilter
  | CellValueFormat
  | CellValueInfo
  | CellValueGenotype
  | CellValueCustom;

// note: add composed field to configCellComposed.d.ts
