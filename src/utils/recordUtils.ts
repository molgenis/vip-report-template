import { Record, RecordSample } from "@molgenis/vip-report-vcf/src/Vcf";
import { Item } from "@molgenis/vip-report-api/src/Api";
import { SampleContainer } from "./sample";
import { ArrayIndexOutOfBoundsException } from "./error";

export function getRecordSample(record: Item<Record>, sample: SampleContainer): RecordSample {
  const recordSample = record.data.s[sample.item.data.index];
  if (recordSample === undefined) throw new ArrayIndexOutOfBoundsException();
  return recordSample;
}
