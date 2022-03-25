import { Container, Metadata, Record } from "./Vcf";
import { MISSING } from "./Constants";

export function write(container: Container): string {
  let lines = [];
  for (const line of writeMetadata(container.metadata)) lines.push(line);
  for (const line of writeData(container)) lines.push(line);
  return lines.join("\n");
}

function writeMetadata(metadata: Metadata) {
  let vcf = [];
  vcf.push("##fileformat=VCFv4.2");
  vcf.push("#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO");
  return vcf;
}

function writeData(container: Container) {
  let vcf = [];
  for (const record of container.data) {
    vcf.push(writeDataRecord(container.metadata, record));
  }
  return vcf;
}

function writeDataRecord(metadata: Metadata, record: Record): string {
  let vcf = [];
  vcf.push(record.c);
  vcf.push(record.p);
  vcf.push(record.i.length > 0 ? record.i.join(",") : MISSING);
  vcf.push(record.r);
  vcf.push(record.a.map((alt) => (alt !== null ? alt : MISSING)));
  vcf.push(record.q !== null ? record.q : MISSING);
  vcf.push(record.f.length > 0 ? record.f.join(",") : MISSING);
  vcf.push(MISSING);
  return vcf.join("\t");
}
