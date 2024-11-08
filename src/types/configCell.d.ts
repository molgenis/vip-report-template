import { FieldMetadata, InfoMetadata, RecordSampleType, Value, VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { CellValueCustom } from "./configCellComposed";

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
export type RecordContext = { valueIndex?: number };

interface ConfigCellBase<T extends CellValue> {
  type: CellType;
  label: () => string;
  description: () => string | null;
  value: (record: Item<VcfRecord>, recordContext: RecordContext) => T;
  valueCount: (record: Item<VcfRecord>) => number;
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

export type ConfigCellFixed =
  | ConfigCellChrom
  | ConfigCellPos
  | ConfigCellId
  | ConfigCellRef
  | ConfigCellAlt
  | ConfigCellQual
  | ConfigCellFilter;

export type CellValueInfo = Value | undefined;

export interface ConfigCellInfo extends ConfigCellBase<CellValueInfo> {
  type: "info";
  field: InfoMetadata;
}

export type CellValueFormat = string[];

export interface ConfigCellFormat extends ConfigCellBase<CellValueFormat> {
  type: "format";
}

export type CellValueGenotype = RecordSampleType | undefined;

export interface ConfigCellGenotype extends ConfigCellBase<CellValueGenotype> {
  type: "genotype";
  field: FieldMetadata;
}

interface ConfigCellCustom<T extends CellValueCustom> extends ConfigCellBase<T> {
  type: "composed";
  id: CellId;
}

export type ConfigCellItem =
  | ConfigCellFixed
  | ConfigCellFormat
  | ConfigCellInfo
  | ConfigCellGenotype
  | ConfigCellCustom<CellValueCustom>;

export interface ConfigCellGroup {
  type: "group";
  fieldConfigs: ConfigCellItem[];
}

export type ConfigCell = ConfigCellItem | ConfigCellGroup;

export type CellValueFixed =
  | CellValueChrom
  | CellValuePos
  | CellValueId
  | CellValueRef
  | CellValueAlt
  | CellValueQual
  | CellValueFilter;

export type CellValue = CellValueFixed | CellValueFormat | CellValueInfo | CellValueGenotype | CellValueCustom;

// note: add composed field to configCellComposed.d.ts
