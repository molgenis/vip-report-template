import type { Note, Classification, ClassificationOption, VariantKey } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import { generateId, retrieveClassificationForUser } from "./NotesApi.utils";

const EMX2_BASE_URL = import.meta.env.DEV ? "/emx2" : "";
const EMX2_SCHEMA = "VERDI";
const EMX2_AUTH_TOKEN = "admin";
const DISCUSSION_FIELD = "VariantDiscussions";
const DISCUSSION_INPUT_TYPE = "VariantDiscussionsInput";
const VARIANT_FIELD = "GenomicVariants";
const VARIANT_INPUT_TYPE = "GenomicVariantsInput";
const VARIANT_SCHEMA = "RD3";
const INDIVIDUAL_FIELD = "Individuals";
const INDIVIDUAL_INPUT_TYPE = "IndividualsInput";
const INTERPRETATION_FIELD = "VariantInterpretations";
const INTERPRETATION_INPUT_TYPE = "VariantInterpretationsInput";
const ANALYSIS_FIELD = "VariantInterpretationAnalyses";
const ANALYSIS_INPUT_TYPE = "VariantInterpretationAnalysesInput";
const CATALOGUE_ONTOLOGIES_SCHEMA = "CatalogueOntologies";
const CLASSIFICATION_OPTIONS_FIELD = "VariantClassifications";

interface GraphQlResponse<T> {
  data?: T;

  errors?: {
    message: string;
  }[];
}

export class EmxSessionExpiredError extends Error {
  readonly status: number;

  constructor(status: number, details?: string) {
    super(`EMX2 session expired or not authenticated (HTTP ${status})${details ? `: ${details}` : ""}`);

    this.name = "EmxSessionExpiredError";
    this.status = status;
  }
}

interface EmxDiscussionRow {
  id: string;

  variantInterpretation?: {
    id: string;
    interpretationAnalysis?: { id: string } | null;
    individual?: { id: string } | null;
    variant?: EmxVariantRow | null;
  } | null;

  nameOfCommenter?: { id: string } | null;
  classification?: EmxClassification | null;
  summary?: string | null;
  timestamp?: string;

  mg_insertedOn?: string;
  mg_updatedOn?: string;
  mg_insertedBy?: string;

  [key: string]: unknown;
}

interface EmxClassification {
  name: string;
  label: string;
}

interface EmxVariantRow {
  id: string;

  chromosome?: { name: string } | null;
  sequenceFeatureID?: string;
  cDNA?: string;
  startPosition?: number | string;
  stopPosition?: number | string;
  referenceAllele?: string;
  alternateAllele?: string;
  transcriptHGVSIds?: string[];
  proteinHGVSIds?: string[];
  repeatUnit?: string;
  repeatCount?: number;
  geneIdOther?: string;

  [key: string]: unknown;
}

interface EmxAnalysisRow {
  id: string;
  individuals?: { id: string }[] | null;

  [key: string]: unknown;
}

interface EmxInterpretationRow {
  id: string;
  classification?: EmxClassification | null;
  classificationSummary?: string | null;
  classificationDate?: string | null;

  [key: string]: unknown;
}

interface EmxInterpretationFullRow {
  id: string;
  interpretationAnalysis?: { id: string } | null;
  individual?: { id: string } | null;
  variant?: { id: string } | null;
  status?: { name: string } | null;
}

type ClassificationOptionsResponse = Record<string, { name: string; label?: string }[] | null | undefined>;

export interface ConsensusClassification {
  value: string;
  label: string;
  summary: string;
}
export class EmxNotesApi implements NotesApi {
  private cachedUserName: string | undefined;
  private userNameRefreshPromise: Promise<string | undefined> | undefined;
  private pendingWrites = 0;
  private userNameListeners: Array<(name: string | undefined) => void> = [];

  constructor(
    private baseUrl: string = EMX2_BASE_URL,
    private schemaResolver: (reportId: string) => string = () => EMX2_SCHEMA,
    private authToken: string = EMX2_AUTH_TOKEN,
  ) {
    void this.refreshCurrentUserName().catch((error) => {
      console.error("[EmxNotesApi] Failed to load current username:", error);
    });
  }

  // ---------------------------------------------------------------------------------------
  // GraphQL
  // ---------------------------------------------------------------------------------------

  private async graphql<T>(
    reportId: string,
    query: string,
    variables?: Record<string, unknown>,
    schemaName?: string,
  ): Promise<T> {
    const schema = schemaName ? schemaName : this.schemaResolver(reportId);

    const baseUrl = this.baseUrl.replace(/\/$/, "");

    const url = `${baseUrl}/${encodeURIComponent(schema)}/api/graphql`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${this.authToken}`,
      },

      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      let errorDetails = "";

      try {
        errorDetails = await response.text();
      } catch {
        // Ignore response-body parsing errors.
      }

      if (response.status === 401 || response.status === 403 || response.status === 404) {
        throw new EmxSessionExpiredError(response.status, errorDetails);
      } else {
        throw new Error(
          `EMX2 GraphQL request failed: ${response.status} ${
            response.statusText
          }${errorDetails ? ` - ${errorDetails}` : ""}`,
        );
      }
    }

    const json = (await response.json()) as GraphQlResponse<T>;

    if (json.errors?.length) {
      throw new Error(json.errors.map((error) => error.message).join("; "));
    }

    if (json.data === undefined) {
      throw new Error("EMX2 GraphQL response contained no data");
    }

    return json.data;
  }

  private getRows<TRow>(data: Record<string, TRow[] | null | undefined>, field: string): TRow[] {
    const rows = data[field];

    if (rows === undefined) {
      console.warn(`[EmxNotesApi] GraphQL response did not contain "${field}". Returning an empty collection.`, data);

      return [];
    }

    if (rows === null) {
      console.warn(`[EmxNotesApi] GraphQL field "${field}" was null. Returning an empty collection.`);

      return [];
    }

    if (!Array.isArray(rows)) {
      console.error(`[EmxNotesApi] GraphQL field "${field}" was not an array.`, rows);

      return [];
    }

    return rows;
  }

  private denormalizeChromosomeName(name: string | undefined | null): string | undefined {
    if (!name) {
      return undefined;
    }

    return /^chr/i.test(name) ? name : `chr${name}`;
  }

  private toNumber(value: number | string | undefined | null): number | undefined {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    const num = typeof value === "number" ? value : Number(value);

    return Number.isNaN(num) ? undefined : num;
  }

  private rowToVariantKey(row: EmxDiscussionRow): VariantKey {
    const variant = row.variantInterpretation?.variant ?? undefined;

    return {
      chromosome: this.denormalizeChromosomeName(variant?.chromosome?.name),
      position: this.toNumber(variant?.startPosition),
      reference: variant?.referenceAllele,
      alternative: variant?.alternateAllele,
      end: this.toNumber(variant?.stopPosition),
      feature: variant?.geneIdOther,
      hgvsC: variant?.transcriptHGVSIds?.[0],
      hgvsP: variant?.proteinHGVSIds?.[0],
      ru: variant?.repeatUnit ?? "",
      ruNr: variant?.repeatCount,
    };
  }

  private variantKeyToId(variantKey: VariantKey): string {
    const parts = [
      variantKey.chromosome,
      variantKey.position,
      variantKey.reference,
      variantKey.alternative,
      variantKey.end,
      variantKey.feature,
      variantKey.hgvsC,
      variantKey.hgvsP,
      variantKey.ru,
      variantKey.ruNr,
    ];

    return parts.map((part) => (part === undefined || part === null ? "" : String(part))).join("|");
  }

  private buildInterpretationId(analysisId: string, variantId: string): string {
    return analysisId + "::" + variantId;
  }

  private extractSequenceFeatureId(hgvsC: string | undefined | null): string | undefined {
    if (!hgvsC) {
      return undefined;
    }

    const colonIndex = hgvsC.indexOf(":");

    if (colonIndex === -1) {
      return undefined;
    }

    const accession = hgvsC.slice(0, colonIndex).trim();

    return accession || undefined;
  }

  private extractCdnaChange(hgvsC: string | undefined | null): string | undefined {
    if (!hgvsC) {
      return undefined;
    }

    const colonIndex = hgvsC.indexOf(":");

    const change = colonIndex === -1 ? hgvsC : hgvsC.slice(colonIndex + 1);

    return change.trim() || undefined;
  }

  private normalizeChromosomeName(chromosome: string | undefined | null): string | undefined {
    if (!chromosome) {
      return undefined;
    }

    const stripped = chromosome.trim().replace(/^chr/i, "");

    return stripped || undefined;
  }

  private buildGenomicVariantRow(id: string, variantKey: VariantKey): EmxVariantRow {
    const chromosomeName = this.normalizeChromosomeName(variantKey.chromosome);

    return {
      id,
      chromosome: chromosomeName ? { name: chromosomeName } : undefined,
      sequenceFeatureID: this.extractSequenceFeatureId(variantKey.hgvsC),
      cDNA: this.extractCdnaChange(variantKey.hgvsC),
      startPosition: variantKey.position,
      stopPosition: variantKey.end,
      referenceAllele: variantKey.reference,
      alternateAllele: variantKey.alternative,
      transcriptHGVSIds: variantKey.hgvsC ? [variantKey.hgvsC] : undefined,
      proteinHGVSIds: variantKey.hgvsP ? [variantKey.hgvsP] : undefined,
      repeatUnit: variantKey.ru || undefined,
      repeatCount: variantKey.ruNr,
      geneIdOther: variantKey.feature || undefined,
    };
  }

  private async findOrCreateVariantId(reportId: string, variantKey: VariantKey): Promise<string> {
    const id = this.variantKeyToId(variantKey);

    const data = await this.graphql<Record<string, { id: string }[] | null | undefined>>(
      reportId,

      `query FindVariant($filter: ${VARIANT_FIELD}Filter) {
        ${VARIANT_FIELD}(filter: $filter) {
          id
        }
      }`,

      { filter: { id: { equals: id } } },

      VARIANT_SCHEMA,
    );
    const rows = this.getRows(data, VARIANT_FIELD);
    if (rows.length > 0) {
      return id;
    }

    await this.graphql(
      reportId,

      `mutation InsertVariant($rows: [${VARIANT_INPUT_TYPE}]) {
        insert(${VARIANT_FIELD}: $rows) {
          message
        }
      }`,

      { rows: [this.buildGenomicVariantRow(id, variantKey)] },

      VARIANT_SCHEMA,
    );

    return id;
  }

  private async findOrCreateIndividualId(reportId: string, sampleId: string): Promise<string> {
    const data = await this.graphql<Record<string, { id: string }[] | null | undefined>>(
      reportId,

      `query FindIndividual($filter: ${INDIVIDUAL_FIELD}Filter) {
        ${INDIVIDUAL_FIELD}(filter: $filter) {
          id
        }
      }`,

      { filter: { id: { equals: sampleId } } },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, INDIVIDUAL_FIELD);

    if (rows.length > 0) {
      return sampleId;
    }

    await this.graphql(
      reportId,

      `mutation InsertIndividual($rows: [${INDIVIDUAL_INPUT_TYPE}]) {
        insert(${INDIVIDUAL_FIELD}: $rows) {
          message
        }
      }`,

      { rows: [{ id: sampleId }] },

      VARIANT_SCHEMA,
    );

    return sampleId;
  }

  private async findOrCreateAnalysisId(reportId: string, individualId: string): Promise<string> {
    const data = await this.graphql<Record<string, EmxAnalysisRow[] | null | undefined>>(
      reportId,

      `query FindAnalysis($filter: ${ANALYSIS_FIELD}Filter) {
        ${ANALYSIS_FIELD}(filter: $filter) {
          id
          individuals {
            id
          }
        }
      }`,

      { filter: { id: { equals: reportId } } },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, ANALYSIS_FIELD);
    const existing = rows[0];

    if (!existing) {
      await this.graphql(
        reportId,

        `mutation InsertAnalysis($rows: [${ANALYSIS_INPUT_TYPE}]) {
          insert(${ANALYSIS_FIELD}: $rows) {
            message
          }
        }`,

        { rows: [{ id: reportId, individuals: [{ id: individualId }] }] },

        VARIANT_SCHEMA,
      );

      return reportId;
    }

    const existingIndividualIds = (existing.individuals ?? []).map((individual) => individual.id);

    if (!existingIndividualIds.includes(individualId)) {
      await this.graphql(
        reportId,

        `mutation UpdateAnalysis($rows: [${ANALYSIS_INPUT_TYPE}]) {
          save(${ANALYSIS_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [
            {
              id: reportId,
              individuals: [...existingIndividualIds.map((id) => ({ id })), { id: individualId }],
            },
          ],
        },

        VARIANT_SCHEMA,
      );
    }

    return reportId;
  }

  private async ensureInterpretation(analysisId: string, variantId: string, individualId: string): Promise<string> {
    const interpretationId = this.buildInterpretationId(analysisId, variantId);
    const data = await this.graphql<Record<string, { id: string }[] | null | undefined>>(
      analysisId,

      `query FindInterpretation($filter: ${INTERPRETATION_FIELD}Filter) {
        ${INTERPRETATION_FIELD}(filter: $filter) {
          id
        }
      }`,

      { filter: { id: { equals: interpretationId } } },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, INTERPRETATION_FIELD);

    if (rows.length > 0) {
      return interpretationId;
    }

    await this.graphql(
      analysisId,

      `mutation InsertInterpretation($rows: [${INTERPRETATION_INPUT_TYPE}]) {
        insert(${INTERPRETATION_FIELD}: $rows) {
          message
        }
      }`,

      {
        rows: [
          {
            id: interpretationId,
            interpretationAnalysis: { id: analysisId },
            variant: { id: variantId },
            individual: { id: individualId },
          },
        ],
      },

      VARIANT_SCHEMA,
    );

    return interpretationId;
  }

  async storeNote(note: Note): Promise<void> {
    this.pendingWrites++;

    try {
      const id = note.id ?? generateId();

      const variantId = await this.findOrCreateVariantId(note.reportId, note.variantKey as VariantKey);

      const individualId = await this.findOrCreateIndividualId(note.reportId, note.sampleId);

      const analysisId = await this.findOrCreateAnalysisId(note.reportId, individualId);

      const interpretationId = await this.ensureInterpretation(analysisId, variantId, individualId);

      const row = {
        id,
        variantInterpretation: { id: interpretationId },
        summary: note.content,
        timestamp: new Date().toISOString(),
      };

      await this.graphql(
        note.reportId,

        `mutation UpsertDiscussion(
          $rows: [${DISCUSSION_INPUT_TYPE}]
        ) {
          save(${DISCUSSION_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [row],
        },

        VARIANT_SCHEMA,
      );
    } finally {
      this.pendingWrites--;
    }
  }

  async retrieveNotes(reportId: string, sampleId?: string): Promise<Note[]> {
    const data = await this.graphql<Record<string, EmxDiscussionRow[] | null | undefined>>(
      reportId,

      `query Notes(
        $filter: ${DISCUSSION_FIELD}Filter
      ) {
        ${DISCUSSION_FIELD}(filter: $filter) {
          id
          summary
          timestamp
 
          variantInterpretation {
            id
            interpretationAnalysis {
              id
            }
            individual {
              id
            }
            variant {
              id
              chromosome {
                name
              }
              sequenceFeatureID
              cDNA
              startPosition
              stopPosition
              referenceAllele
              alternateAllele
              transcriptHGVSIds
              proteinHGVSIds
              repeatUnit
              repeatCount
              geneIdOther
            }
          }
 
          mg_insertedOn
          mg_updatedOn
          mg_insertedBy
        }
      }`,

      {
        filter: {
          variantInterpretation: {
            interpretationAnalysis: { id: { equals: reportId } },
          },
        },
      },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, DISCUSSION_FIELD);
    const noteRows = rows.filter((row) => row.summary !== undefined && row.summary !== null && row.summary !== "");

    return noteRows.map((row) => this.rowToNote(row, reportId, sampleId));
  }

  private rowToNote(row: EmxDiscussionRow, reportId: string, sampleId?: string): Note {
    return {
      id: row.id,
      content: row.summary as string,
      sampleId: row.variantInterpretation?.individual?.id ?? sampleId ?? "",
      reportId,
      variantKey: this.rowToVariantKey(row),
      createdAt: row.mg_insertedOn ? new Date(row.mg_insertedOn) : new Date(),
      updatedAt: row.mg_updatedOn ? new Date(row.mg_updatedOn) : new Date(),
      createdBy: row.mg_insertedBy ?? "",
    } as Note;
  }

  async removeNote(id: string, reportId: string): Promise<void> {
    this.pendingWrites++;

    try {
      await this.graphql(
        reportId,

        `mutation DeleteDiscussion(
          $rows: [${DISCUSSION_INPUT_TYPE}]
        ) {
          delete(${DISCUSSION_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [{ id }],
        },

        VARIANT_SCHEMA,
      );
    } finally {
      this.pendingWrites--;
    }
  }

  async storeClassification(
    classification: Omit<Classification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Classification> {
    this.pendingWrites++;

    try {
      const existing = await retrieveClassificationForUser(
        this,
        classification.variantKey,
        classification.reportId,
        classification.sampleId,
        this.cachedUserName,
      );

      const id = existing?.id ?? generateId();

      const variantId = await this.findOrCreateVariantId(
        classification.reportId,
        classification.variantKey as VariantKey,
      );

      const individualId = await this.findOrCreateIndividualId(classification.reportId, classification.sampleId);

      const analysisId = await this.findOrCreateAnalysisId(classification.reportId, individualId);

      const interpretationId = await this.ensureInterpretation(analysisId, variantId, individualId);

      const row = {
        id,
        variantInterpretation: { id: interpretationId },
        classification: { name: classification.value },
        timestamp: new Date().toISOString(),
      };

      await this.graphql(
        classification.reportId,

        `mutation UpsertDiscussion(
          $rows: [${DISCUSSION_INPUT_TYPE}]
        ) {
          save(${DISCUSSION_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [row],
        },
        VARIANT_SCHEMA,
      );

      return {
        ...classification,
        id,
        createdAt: existing?.createdAt ?? new Date(),
        updatedAt: new Date(),
        createdBy: existing?.createdBy ?? "",
      } as Classification;
    } finally {
      this.pendingWrites--;
    }
  }

  async retrieveClassifications(reportId: string, sampleId?: string): Promise<Classification[]> {
    const data = await this.graphql<Record<string, EmxDiscussionRow[] | null | undefined>>(
      reportId,

      `query Classifications(
        $filter: ${DISCUSSION_FIELD}Filter
      ) {
        ${DISCUSSION_FIELD}(filter: $filter) {
          id
          classification {
            name
            label
          }
          timestamp
 
          variantInterpretation {
            id
            interpretationAnalysis {
              id
            }
            individual {
              id
            }
            variant {
              id
              chromosome {
                name
              }
              sequenceFeatureID
              cDNA
              startPosition
              stopPosition
              referenceAllele
              alternateAllele
              transcriptHGVSIds
              proteinHGVSIds
              repeatUnit
              repeatCount
              geneIdOther
            }
          }
 
          mg_insertedOn
          mg_updatedOn
          mg_insertedBy
        }
      }`,

      {
        filter: {
          variantInterpretation: {
            interpretationAnalysis: { id: { equals: reportId } },
          },
        },
      },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, DISCUSSION_FIELD);
    const classificationRows = rows.filter((row) => !!row.classification);

    return classificationRows.map((row) => this.rowToClassification(row, reportId, sampleId));
  }

  private showOtherFeatures = false;
  getShowOtherFeatures() {
    return this.showOtherFeatures;
  }

  setShowOtherFeatures(showOtherFeatures: boolean) {
    this.showOtherFeatures = showOtherFeatures;
  }

  private rowToClassification(row: EmxDiscussionRow, reportId: string, sampleId?: string): Classification {
    return {
      id: row.id,
      value: row.classification?.name ?? "",
      status: "pending",
      sampleId: row.variantInterpretation?.individual?.id ?? sampleId ?? "",
      reportId,
      variantKey: this.rowToVariantKey(row),
      createdAt: row.mg_insertedOn ? new Date(row.mg_insertedOn) : new Date(),
      updatedAt: row.mg_updatedOn ? new Date(row.mg_updatedOn) : new Date(),
      createdBy: row.mg_insertedBy ?? "",
    } as Classification;
  }

  async removeClassification(id: string, _sampleId: string, reportId: string): Promise<void> {
    this.pendingWrites++;

    try {
      await this.graphql(
        reportId,

        `mutation DeleteDiscussion(
          $rows: [${DISCUSSION_INPUT_TYPE}]
        ) {
          delete(${DISCUSSION_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [{ id }],
        },

        VARIANT_SCHEMA,
      );
    } finally {
      this.pendingWrites--;
    }
  }

  // ---------------------------------------------------------------------------------------
  // Consensus classification
  //
  // The consensus classification + its summary live directly on the VariantInterpretations
  // row itself (columns "classification" / "classification summary" in the EMX2 model, i.e.
  // GraphQL fields `classification` / `classificationSummary`) - NOT on VariantDiscussions,
  // which is where individual users' own classifications/notes are stored. The
  // VariantInterpretations row for a given report + variant is expected to already exist by
  // the time these are called (created via ensureInterpretation as part of storeNote/
  // storeClassification), so both methods below just resolve its deterministic id and
  // read/update it directly.
  // ---------------------------------------------------------------------------------------

  async getConsensusClassification(
    reportId: string,
    variantKey: VariantKey,
  ): Promise<ConsensusClassification | undefined> {
    const interpretationId = this.buildInterpretationId(reportId, this.variantKeyToId(variantKey));

    const data = await this.graphql<Record<string, EmxInterpretationRow[] | null | undefined>>(
      reportId,

      `query ConsensusClassification($filter: ${INTERPRETATION_FIELD}Filter) {
        ${INTERPRETATION_FIELD}(filter: $filter) {
          id
          classification {
            name
            label
          }
          classificationSummary
        }
      }`,

      { filter: { id: { equals: interpretationId } } },

      VARIANT_SCHEMA,
    );

    const rows = this.getRows(data, INTERPRETATION_FIELD);
    const row = rows[0];

    if (!row || !row.classification) {
      return undefined;
    }

    return {
      value: row.classification.name,
      label: row.classification.label || row.classification.name,
      summary: row.classificationSummary ?? "",
    };
  }

  async storeConsensusClassification(
    reportId: string,
    variantKey: VariantKey,
    value: string,
    summary: string,
  ): Promise<void> {
    this.pendingWrites++;

    try {
      const interpretationId = this.buildInterpretationId(reportId, this.variantKeyToId(variantKey));

      // Re-read the row's other links first. IMPORTANT: EMX2's `save` mutation replaces
      // exactly the fields given in the payload - it does not merge - so if we sent only
      // id/classification/classificationSummary/classificationDate (as the original version
      // of this method did), interpretationAnalysis/individual/variant/status would all get
      // wiped back to empty on every consensus save. That in turn silently broke
      // retrieveNotes/retrieveClassifications for that variant, since those filter on
      // variantInterpretation.interpretationAnalysis.id - a row with that link nulled out no
      // longer matches, even though its linked notes/classifications are still in the DB
      // untouched. Carrying the existing links forward in the same save call prevents that.
      const existingData = await this.graphql<Record<string, EmxInterpretationFullRow[] | null | undefined>>(
        reportId,

        `query ExistingInterpretation($filter: ${INTERPRETATION_FIELD}Filter) {
          ${INTERPRETATION_FIELD}(filter: $filter) {
            id
            interpretationAnalysis {
              id
            }
            individual {
              id
            }
            variant {
              id
            }
            status {
              name
            }
          }
        }`,

        { filter: { id: { equals: interpretationId } } },

        VARIANT_SCHEMA,
      );

      const existingRows = this.getRows(existingData, INTERPRETATION_FIELD);
      const existing = existingRows[0];

      if (!existing) {
        throw new Error(
          `No VariantInterpretations row found for id "${interpretationId}"; cannot update consensus on a row that hasn't been created yet.`,
        );
      }

      await this.graphql(
        reportId,

        `mutation UpdateConsensusClassification($rows: [${INTERPRETATION_INPUT_TYPE}]) {
          save(${INTERPRETATION_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [
            {
              id: interpretationId,
              interpretationAnalysis: existing.interpretationAnalysis
                ? { id: existing.interpretationAnalysis.id }
                : undefined,
              individual: existing.individual ? { id: existing.individual.id } : undefined,
              variant: existing.variant ? { id: existing.variant.id } : undefined,
              status: existing.status ? { name: existing.status.name } : undefined,
              classification: { name: value },
              classificationSummary: summary,
              classificationDate: new Date().toISOString().slice(0, 10),
            },
          ],
        },

        VARIANT_SCHEMA,
      );
    } finally {
      this.pendingWrites--;
    }
  }

  async getClassificationOptions(): Promise<ClassificationOption[]> {
    const data = await this.graphql<ClassificationOptionsResponse>(
      "",

      `query ClassificationOptions {
        ${CLASSIFICATION_OPTIONS_FIELD} {
          name
          label
        }
      }`,
      undefined,
      CATALOGUE_ONTOLOGIES_SCHEMA,
    );

    const rows = this.getRows(data, CLASSIFICATION_OPTIONS_FIELD);
    return rows.map((row) => ({
      value: row.name,
      label: row.label || row.name,
    }));
  }

  isUsernameFromBackend(): boolean {
    return true;
  }

  onUserNameChange(callback: (name: string | undefined) => void): () => void {
    this.userNameListeners.push(callback);

    return () => {
      this.userNameListeners = this.userNameListeners.filter((listener) => listener !== callback);
    };
  }

  private notifyUserNameChange(name: string | undefined): void {
    for (const listener of [...this.userNameListeners]) {
      try {
        listener(name);
      } catch (error) {
        console.error("[EmxNotesApi] Username listener failed:", error);
      }
    }
  }

  getCurrentUserName(): string | undefined {
    return this.cachedUserName;
  }

  async refreshCurrentUserName(): Promise<string | undefined> {
    if (this.userNameRefreshPromise) {
      return this.userNameRefreshPromise;
    }

    this.userNameRefreshPromise = this.loadCurrentUserName();

    try {
      return await this.userNameRefreshPromise;
    } finally {
      this.userNameRefreshPromise = undefined;
    }
  }

  private async loadCurrentUserName(): Promise<string | undefined> {
    const data = await this.graphql<{
      _session?: {
        email?: string;
      } | null;
    }>(
      EMX2_SCHEMA,

      `{
        _session {
          email
        }
      }`,
    );

    const newUserName = data._session?.email;
    const changed = this.cachedUserName !== newUserName;
    this.cachedUserName = newUserName;

    if (changed) {
      this.notifyUserNameChange(this.cachedUserName);
    }

    return this.cachedUserName;
  }

  setCurrentUserName(): void {
    // No-op.
  }

  hasUnsavedData(): boolean {
    return this.pendingWrites > 0;
  }

  setSavedState(): void {
    /**
     * No-op.
     */
  }

  clear(reportId: string): void {
    void this.clearAsync(reportId).catch((error) => {
      console.error("EmxNotesApi.clear failed:", error);
    });
  }

  async clearAsync(reportId: string): Promise<void> {
    const [notes, classifications] = await Promise.all([
      this.retrieveNotes(reportId),

      this.retrieveClassifications(reportId),
    ]);

    const allIds = [...notes, ...classifications].map((row) => ({ id: row.id }));

    if (allIds.length === 0) {
      return;
    }

    await this.graphql(
      reportId,

      `mutation DeleteAllDiscussions(
        $rows: [${DISCUSSION_INPUT_TYPE}]
      ) {
        delete(${DISCUSSION_FIELD}: $rows) {
          message
        }
      }`,

      {
        rows: allIds,
      },

      VARIANT_SCHEMA,
    );
  }
}
