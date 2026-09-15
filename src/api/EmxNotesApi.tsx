import type { Note, Classification, ClassificationOption, VariantKey } from "../types/NotesApi";
import type { NotesApi } from "./NotesApi";
import { generateId, retrieveClassificationForUser, sameVariantAndFeature } from "./NotesApi.utils";

/**
 * EMX2 GraphQL configuration.
 *
 * IMPORTANT:
 * The browser must use the Vite proxy path `/emx2`.
 *
 * Browser:
 *   http://localhost:5173/emx2/VERDI/api/graphql
 *
 * Vite proxy:
 *   http://localhost:8080/VERDI/api/graphql
 *
 * Do NOT put http://localhost:8080 here.
 */
const EMX2_BASE_URL = "/emx2";

/**
 * EMX2 schema/database.
 */
const EMX2_SCHEMA = "VERDI";

/**
 * Authentication token.
 */
const EMX2_AUTH_TOKEN = "admin";

/**
 * EMX2 table names as they appear in GraphQL.
 *
 * Table names with spaces ("VIP Notes") map to GraphQL field/type
 * names with spaces stripped ("VIPNotes").
 */
const NOTES_FIELD = "VIPNotes";
const NOTES_INPUT_TYPE = "VIPNotesInput";

const CLASSIFICATIONS_FIELD = "VIPClassification";
const CLASSIFICATIONS_INPUT_TYPE = "VIPClassificationInput";

/**
 * VIP Variant is now its own table (auto_id primary key "id").
 * VIP Notes / VIP Classification reference it through the "variant"
 * ref column instead of storing variant fields flat on the row.
 */
const VARIANT_FIELD = "VIPVariant";
const VARIANT_INPUT_TYPE = "VIPVariantInput";

interface GraphQlResponse<T> {
  data?: T;

  errors?: {
    message: string;
  }[];
}

/**
 * Thrown when EMX2 responds in a way that indicates the current
 * session is no longer valid (expired session / not authenticated).
 *
 * Depending on EMX2 version/configuration this can surface as
 * 401, 403, or 404 on the GraphQL endpoint — all three are treated
 * as "logged out" here.
 *
 * Consumers (e.g. ErrorNotification) can check for this with
 * `error instanceof EmxSessionExpiredError` to show a dedicated
 * "please log in again" message instead of a generic error.
 */
export class EmxSessionExpiredError extends Error {
  readonly status: number;

  constructor(status: number, details?: string) {
    super(`EMX2 session expired or not authenticated (HTTP ${status})${details ? `: ${details}` : ""}`);

    this.name = "EmxSessionExpiredError";
    this.status = status;
  }
}

/**
 * A row from VIP Notes / VIP Classification.
 *
 * "variant" is now a nested object (the referenced VIP Variant row),
 * not flat columns on this row.
 */
interface EmxRow {
  id: string;
  sampleId: string;

  content?: string;
  value?: string;
  status?: string;

  variant?: EmxVariantRow | null;

  mg_insertedOn?: string;
  mg_updatedOn?: string;
  mg_insertedBy?: string;

  [key: string]: unknown;
}

/**
 * A row from VIP Variant.
 */
interface EmxVariantRow {
  id: string;

  chromosome?: string;
  position?: number;
  reference?: string;
  alternative?: string;
  end?: number;

  feature?: string;
  hgvsC?: string;
  hgvsP?: string;

  ru?: string;
  ruNr?: number;

  [key: string]: unknown;
}

/**
 * NotesApi implementation backed by MOLGENIS EMX2 GraphQL.
 *
 * Authentication:
 *   Authorization: Bearer admin
 *
 * The frontend talks to:
 *
 *   /emx2/VERDI/api/graphql
 *
 * Vite proxies this to:
 *
 *   http://localhost:8080/VERDI/api/graphql
 *
 * USERNAME:
 *
 * The authenticated username is loaded automatically in the
 * constructor.
 *
 * getCurrentUserName() is synchronous and only reads the
 * in-memory cache.
 *
 * Consumers can subscribe using onUserNameChange() if they
 * need to react when the asynchronous lookup finishes.
 *
 * VARIANTS:
 *
 * VIP Variant has an auto_id primary key, so there is no natural
 * key to upsert against at the database level. Storing a note or
 * classification therefore first looks up a matching VIP Variant
 * row by its biological fields (chromosome/position/reference/
 * alternative/end/feature/hgvsC/hgvsP/ru/ruNr) and creates one if
 * none exists, then references it by id. See findOrCreateVariantId().
 */
export class EmxNotesApi implements NotesApi {
  // ---------------------------------------------------------------------------------------
  // state
  // ---------------------------------------------------------------------------------------

  /**
   * Cached authenticated username.
   *
   * This is populated asynchronously from EMX2.
   */
  private cachedUserName: string | undefined;

  /**
   * Promise for the currently running username request.
   *
   * Prevents duplicate requests.
   */
  private userNameRefreshPromise: Promise<string | undefined> | undefined;

  /**
   * Number of currently running write operations.
   */
  private pendingWrites = 0;

  /**
   * List of callbacks interested in username changes.
   */
  private userNameListeners: Array<(name: string | undefined) => void> = [];

  constructor(
    private baseUrl: string = EMX2_BASE_URL,

    /**
     * Currently all requests go to the VERDI schema.
     *
     * The reportId is still accepted because it is part
     * of the NotesApi interface.
     */
    private schemaResolver: (reportId: string) => string = () => EMX2_SCHEMA,

    private authToken: string = EMX2_AUTH_TOKEN,
  ) {
    /**
     * Start loading the authenticated user immediately.
     *
     * This intentionally does not use await because constructors
     * cannot be async.
     *
     * getCurrentUserName() remains synchronous.
     */
    void this.refreshCurrentUserName().catch((error) => {
      console.error("[EmxNotesApi] Failed to load current username:", error);
    });
  }

  // ---------------------------------------------------------------------------------------
  // GraphQL
  // ---------------------------------------------------------------------------------------

  private async graphql<T>(reportId: string, query: string, variables?: Record<string, unknown>): Promise<T> {
    const schema = this.schemaResolver(reportId);

    const baseUrl = this.baseUrl.replace(/\/$/, "");

    const url = `${baseUrl}/${encodeURIComponent(schema)}/api/graphql`;

    console.log("[EmxNotesApi] GraphQL request:", url);

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
      }

      throw new Error(
        `EMX2 GraphQL request failed: ${response.status} ${
          response.statusText
        }${errorDetails ? ` - ${errorDetails}` : ""}`,
      );
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

  /**
   * Safely gets a row collection from a GraphQL response.
   *
   * A missing field is treated as an empty collection.
   */
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

  // ---------------------------------------------------------------------------------------
  // variant helpers
  // ---------------------------------------------------------------------------------------

  private rowToVariantKey(row: EmxRow): VariantKey {
    const variant = row.variant ?? undefined;

    return {
      chromosome: variant?.chromosome,
      position: variant?.position,
      reference: variant?.reference,
      alternative: variant?.alternative,
      end: variant?.end,
      feature: variant?.feature,
      hgvsC: variant?.hgvsC,
      hgvsP: variant?.hgvsP,
      ru: variant?.ru === undefined ? "" : variant.ru,
      ruNr: variant?.ruNr,
    };
  }

  /**
   * Builds an EMX2 filter object from a VariantKey, skipping fields
   * that are undefined/null/empty so they don't narrow the match.
   */
  private variantKeyToFilter(variantKey: VariantKey): Record<string, { equals: unknown }> {
    const filter: Record<string, { equals: unknown }> = {};

    for (const [field, value] of Object.entries(variantKey)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }

      filter[field] = { equals: value };
    }

    return filter;
  }

  /**
   * Finds a VIP Variant row matching the given variant key, if any.
   */
  private async findVariant(reportId: string, variantKey: VariantKey): Promise<EmxVariantRow | undefined> {
    const filter = this.variantKeyToFilter(variantKey);

    const data = await this.graphql<Record<string, EmxVariantRow[] | null | undefined>>(
      reportId,

      `query FindVariant($filter: ${VARIANT_FIELD}Filter) {
        ${VARIANT_FIELD}(filter: $filter) {
          id
          chromosome
          position
          reference
          alternative
          end
          feature
          hgvsC
          hgvsP
          ru
          ruNr
        }
      }`,

      { filter },
    );

    const rows = this.getRows(data, VARIANT_FIELD);

    return rows[0];
  }

  /**
   * Finds the VIP Variant row matching the given variant key, or
   * creates one if it doesn't exist yet, and returns its id.
   *
   * VIP Variant uses an auto_id primary key, so there is no natural
   * key to upsert against server-side — this does a look-up first,
   * then an insert-and-refetch when nothing matches.
   *
   * Note: under concurrent requests for a brand-new variant, this
   * can race and create a duplicate VIP Variant row. If that's a
   * concern, consider adding a unique/composite key on the variant
   * fields in the schema so "update" (upsert) can be used instead.
   */
  private async findOrCreateVariantId(reportId: string, variantKey: VariantKey): Promise<string> {
    const existing = await this.findVariant(reportId, variantKey);

    if (existing) {
      return existing.id;
    }

    await this.graphql(
      reportId,

      `mutation InsertVariant($rows: [${VARIANT_INPUT_TYPE}]) {
        insert(${VARIANT_FIELD}: $rows) {
          message
        }
      }`,

      { rows: [variantKey] },
    );

    const created = await this.findVariant(reportId, variantKey);

    if (!created) {
      throw new Error("EMX2: failed to locate VIP Variant row immediately after insert");
    }

    return created.id;
  }

  // ---------------------------------------------------------------------------------------
  // notes
  // ---------------------------------------------------------------------------------------

  async storeNote(note: Note): Promise<void> {
    this.pendingWrites++;

    try {
      const id = note.id ?? generateId();

      const variantId = await this.findOrCreateVariantId(note.reportId, note.variantKey as VariantKey);

      const row = {
        id,

        content: note.content,

        sampleId: note.sampleId,

        variant: { id: variantId },
      };

      await this.graphql(
        note.reportId,

        `mutation UpsertNotes(
          $rows: [${NOTES_INPUT_TYPE}]
        ) {
          save(${NOTES_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [row],
        },
      );
    } finally {
      this.pendingWrites--;
    }
  }

  async retrieveNotes(reportId: string, sampleId?: string): Promise<Note[]> {
    const data = await this.graphql<Record<string, EmxRow[] | null | undefined>>(
      reportId,

      `query Notes(
        $filter: ${NOTES_FIELD}Filter
      ) {
        ${NOTES_FIELD}(filter: $filter) {
          id
          content
          sampleId

          variant {
            chromosome
            position
            reference
            alternative
            end

            feature
            hgvsC
            hgvsP

            ru
            ruNr
          }

          mg_insertedOn
          mg_updatedOn
          mg_insertedBy
        }
      }`,

      {
        filter: sampleId
          ? {
              sampleId: {
                equals: sampleId,
              },
            }
          : undefined,
      },
    );

    const rows = this.getRows(data, NOTES_FIELD);

    return rows.map((row) => this.rowToNote(row, reportId));
  }

  private rowToNote(row: EmxRow, reportId: string): Note {
    return {
      id: row.id,

      content: row.content as string,

      sampleId: row.sampleId,

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

        `mutation DeleteNotes(
          $rows: [${NOTES_INPUT_TYPE}]
        ) {
          delete(${NOTES_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [{ id }],
        },
      );
    } finally {
      this.pendingWrites--;
    }
  }

  // ---------------------------------------------------------------------------------------
  // classifications
  // ---------------------------------------------------------------------------------------

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

      const row = {
        id,

        value: classification.value,

        sampleId: classification.sampleId,

        // NOTE: "status" is intentionally omitted — VIP Classification
        // has no "status" column in EMX2 yet. Add one to the schema
        // (columnType: string) and restore this line if/when needed:
        // status: classification.status,

        variant: { id: variantId },
      };

      await this.graphql(
        classification.reportId,

        `mutation UpsertClassifications(
          $rows: [${CLASSIFICATIONS_INPUT_TYPE}]
        ) {
          save(${CLASSIFICATIONS_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [row],
        },
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
    const data = await this.graphql<Record<string, EmxRow[] | null | undefined>>(
      reportId,

      `query Classifications(
        $filter: ${CLASSIFICATIONS_FIELD}Filter
      ) {
        ${CLASSIFICATIONS_FIELD}(filter: $filter) {
          id
          value
          sampleId

          variant {
            chromosome
            position
            reference
            alternative
            end

            feature
            hgvsC
            hgvsP

            ru
            ruNr
          }

          mg_insertedOn
          mg_updatedOn
          mg_insertedBy
        }
      }`,

      {
        filter: sampleId
          ? {
              sampleId: {
                equals: sampleId,
              },
            }
          : undefined,
      },
    );

    /**
     * EMX2 may return:
     *
     *   {
     *     "data": {}
     *   }
     *
     * rather than:
     *
     *   {
     *     "data": {
     *       "VIPClassification": []
     *     }
     *   }
     *
     * Missing VIPClassification is therefore treated as
     * "there are no classifications".
     */
    const rows = this.getRows(data, CLASSIFICATIONS_FIELD);

    return rows.map((row) => this.rowToClassification(row, reportId));
  }

  private rowToClassification(row: EmxRow, reportId: string): Classification {
    return {
      id: row.id,

      value: row.value as string,

      // "status" has no backing column in EMX2 yet — defaulted here.
      // Once the schema has a "status" column, switch back to:
      // status: row.status as string,
      status: (row.status as string) ?? "",

      sampleId: row.sampleId,

      reportId,

      variantKey: this.rowToVariantKey(row),

      createdAt: row.mg_insertedOn ? new Date(row.mg_insertedOn) : new Date(),

      updatedAt: row.mg_updatedOn ? new Date(row.mg_updatedOn) : new Date(),

      createdBy: row.mg_insertedBy ?? "",
    } as Classification;
  }

  private async findClassification(
    reportId: string,
    sampleId: string,
    variantKey: VariantKey,
  ): Promise<Classification | undefined> {
    const candidates = await this.retrieveClassifications(reportId, sampleId);

    return candidates.find((classification) =>
      sameVariantAndFeature(classification.variantKey as VariantKey, variantKey),
    );
  }

  async removeClassification(id: string, _sampleId: string, reportId: string): Promise<void> {
    this.pendingWrites++;

    try {
      await this.graphql(
        reportId,

        `mutation DeleteClassifications(
          $rows: [${CLASSIFICATIONS_INPUT_TYPE}]
        ) {
          delete(${CLASSIFICATIONS_FIELD}: $rows) {
            message
          }
        }`,

        {
          rows: [{ id }],
        },
      );
    } finally {
      this.pendingWrites--;
    }
  }

  // ---------------------------------------------------------------------------------------
  // classification options
  // ---------------------------------------------------------------------------------------

  async getClassificationOptions(): Promise<ClassificationOption[]> {
    /**
     * No classification-options table
     * was provided.
     */
    return [];
  }

  // ---------------------------------------------------------------------------------------
  // user
  // ---------------------------------------------------------------------------------------

  isUsernameFromBackend(): boolean {
    return true;
  }

  /**
   * Register a callback that is called when the username
   * becomes available or changes.
   *
   * Example:
   *
   *   const unsubscribe =
   *     api.onUserNameChange((username) => {
   *       console.log(username);
   *     });
   *
   *   unsubscribe();
   */
  onUserNameChange(callback: (name: string | undefined) => void): () => void {
    this.userNameListeners.push(callback);

    return () => {
      this.userNameListeners = this.userNameListeners.filter((listener) => listener !== callback);
    };
  }

  private notifyUserNameChange(name: string | undefined): void {
    /**
     * Copy the array first so a listener can safely
     * unsubscribe itself while notifications are running.
     */
    for (const listener of [...this.userNameListeners]) {
      try {
        listener(name);
      } catch (error) {
        console.error("[EmxNotesApi] Username listener failed:", error);
      }
    }
  }

  /**
   * Synchronous username getter.
   *
   * This method NEVER performs a network request.
   *
   * It simply returns the currently cached username.
   *
   * Before the initial GraphQL request finishes, this can
   * temporarily be undefined.
   */
  getCurrentUserName(): string | undefined {
    return this.cachedUserName;
  }

  /**
   * Refreshes the username from EMX2.
   *
   * Multiple callers share the same request.
   */
  async refreshCurrentUserName(): Promise<string | undefined> {
    /**
     * Don't start another request if one is already running.
     */
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

  /**
   * Performs the actual username GraphQL request.
   */
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

    console.log("[EmxNotesApi] Current user:", this.cachedUserName);

    if (changed) {
      this.notifyUserNameChange(this.cachedUserName);
    }

    return this.cachedUserName;
  }

  /**
   * Compatibility method for the NotesApi interface.
   *
   * The backend determines the authenticated user,
   * so there is nothing to set locally.
   */
  setCurrentUserName(): void {
    // No-op.
  }

  // ---------------------------------------------------------------------------------------
  // save state
  // ---------------------------------------------------------------------------------------

  hasUnsavedData(): boolean {
    return this.pendingWrites > 0;
  }

  setSavedState(): void {
    /**
     * No-op.
     *
     * Writes are sent directly to EMX2.
     */
  }

  // ---------------------------------------------------------------------------------------
  // clear
  // ---------------------------------------------------------------------------------------

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

    await Promise.all([
      notes.length
        ? this.graphql(
            reportId,

            `mutation DeleteAllNotes(
              $rows: [${NOTES_INPUT_TYPE}]
            ) {
              delete(${NOTES_FIELD}: $rows) {
                message
              }
            }`,

            {
              rows: notes.map((note) => ({
                id: note.id,
              })),
            },
          )
        : Promise.resolve(),

      classifications.length
        ? this.graphql(
            reportId,

            `mutation DeleteAllClassifications(
              $rows: [${CLASSIFICATIONS_INPUT_TYPE}]
            ) {
              delete(${CLASSIFICATIONS_FIELD}: $rows) {
                message
              }
            }`,

            {
              rows: classifications.map((classification) => ({
                id: classification.id,
              })),
            },
          )
        : Promise.resolve(),
    ]);
  }
}
