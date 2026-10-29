import { Component, For, Show } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { Item } from "@molgenis/vip-report-api";
import { RecordsTableCellLine } from "./RecordsTable.tsx";
import { Abbr } from "./Abbr";
import { ConfigCellInfo } from "../types/configCells";

export type FieldGroup = { title: string; fields: ConfigCellInfo[] };

// Consequence (CSQ) fields by subject, first match wins; anything unmatched ends up under "Other".
const CSQ_GROUPS: { title: string; pattern: RegExp }[] = [
  { title: "VIP", pattern: /^VIP/ },
  {
    title: "Transcript and protein",
    pattern:
      /^(Allele|ALLELE_NUM|Consequence|IMPACT|SYMBOL|SYMBOL_SOURCE|Gene|HGNC_ID|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|HGVS_OFFSET|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|STRAND|DISTANCE|FLAGS|PICK|CANONICAL|MANE.*|TSL|APPRIS|CCDS|ENSP|SWISSPROT|TREMBL|UNIPARC|UNIPROT_ISOFORM|REFSEQ_MATCH|SOURCE|GIVEN_REF|USED_REF|BAM_EDIT)$/,
  },
  { title: "Population frequency", pattern: /gnomad|(^|_)AF($|_)|MAX_AF/i },
  { title: "Clinical evidence", pattern: /clinvar|vkgl|CLIN_SIG|Existing_variation|PUBMED|SOMATIC|PHENO|hgmd/i },
  {
    title: "Predictions",
    pattern:
      /sift|polyphen|capice|spliceai|phylop|grantham|ncer|remm|fathmm|cadd|revel|alphamissense|gerp|maxent|annotsv/i,
  },
  { title: "Gene and phenotype", pattern: /hpo|inheritance|gado|penetrance|gene_pheno/i },
];

export function groupConsequenceFields(fields: ConfigCellInfo[]): FieldGroup[] {
  const groups: FieldGroup[] = [
    ...CSQ_GROUPS.map((group) => ({ title: group.title, fields: [] })),
    { title: "Other", fields: [] },
  ];
  for (const field of fields) {
    const index = CSQ_GROUPS.findIndex((group) => group.pattern.test(field.field.id));
    groups[index === -1 ? groups.length - 1 : index]!.fields.push(field);
  }
  return groups;
}

function isEmpty(fieldConfig: ConfigCellInfo, record: Item<VcfRecord>, valueIndex: number) {
  const value = fieldConfig.value(record, valueIndex);
  return value === null || value === undefined || (Array.isArray(value) && value.length === 0);
}

// One group of annotations as a card of label/value pairs; hidden when it has nothing to show.
export const AnnotationGroup: Component<{
  title: string;
  fields: ConfigCellInfo[];
  record: Item<VcfRecord>;
  // the consequence for CSQ fields, otherwise null to show every value of the field
  valueIndex: number | null;
  isShowEmpty: boolean;
}> = (props) => {
  const indices = (fieldConfig: ConfigCellInfo) =>
    props.valueIndex !== null ? [props.valueIndex] : [...Array(fieldConfig.valueCount(props.record)).keys()];
  const visible = () =>
    props.fields.filter(
      (fieldConfig) => props.isShowEmpty || indices(fieldConfig).some((i) => !isEmpty(fieldConfig, props.record, i)),
    );

  return (
    <Show when={visible().length > 0}>
      <section class="annotation-group">
        <h3 class="annotation-group-title">{props.title}</h3>
        <dl>
          <For each={visible()}>
            {(fieldConfig) => (
              <div>
                <dt>
                  <Show when={fieldConfig.description()} fallback={fieldConfig.label()}>
                    {(description) => <Abbr title={description()} value={fieldConfig.label()} />}
                  </Show>
                </dt>
                <dd>
                  <For each={indices(fieldConfig)}>
                    {(valueIndex) => (
                      <RecordsTableCellLine fieldConfig={fieldConfig} record={props.record} valueIndex={valueIndex} />
                    )}
                  </For>
                </dd>
              </div>
            )}
          </For>
        </dl>
      </section>
    </Show>
  );
};
