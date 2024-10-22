import { Component, Show } from "solid-js";
import { PagedItems } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "./Loader";
import { Sort, SortChangeCallback, SortClearCallback, SortOption } from "./Sort";
import { PageChangeCallback, Pager } from "./Pager";
import { RecordsTable } from "./RecordsTable";
import { RecordsPerPage, RecordsPerPageChangeCallback } from "./RecordsPerPage";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { ButtonDownload } from "./form/ButtonDownload";
import { ConfigCells } from "../types/config";
import { ConfigCellGroup, ConfigCellInfo } from "../types/configCell";
import { DIRECTION_ASCENDING, DIRECTION_DESCENDING } from "../utils/sortUtils";

import { MetadataContainer } from "../Api.ts";

export type RecordsDownloadCallback = () => void;

export const VariantResults: Component<{
  metadata: MetadataContainer;
  fieldConfigs: ConfigCells;
  records: PagedItems<Record>;
  onRecordsPerPageChange: RecordsPerPageChangeCallback;
  onRecordsDownload: RecordsDownloadCallback;
  onPageChange: PageChangeCallback;
  onSortChange: SortChangeCallback;
  onSortClear: SortClearCallback;
}> = (props) => {
  // TODO discuss: configure sorting / sorting custom fields
  const sortOptions = (): SortOption[] =>
    props.fieldConfigs
      .flatMap((fieldConfig) =>
        fieldConfig.type === "group" ? (fieldConfig as ConfigCellGroup).fieldConfigs : [fieldConfig],
      )
      .filter((fieldConfig) => fieldConfig.type === "info")
      .map((fieldConfig) => fieldConfig as ConfigCellInfo)
      .flatMap((fieldConfig) => [
        {
          order: { field: fieldConfig.field, direction: DIRECTION_ASCENDING },
          selected: undefined,
        },
        {
          order: { field: fieldConfig.field, direction: DIRECTION_DESCENDING },
          selected: undefined,
        },
      ]);

  return (
    <>
      <div class="columns is-gapless">
        <div class="column is-offset-1-fullhd is-3-fullhd is-4">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => (
              <span class="is-pulled-left inline-control-text ml-2">{records.page.totalElements} records</span>
            )}
          </Show>
        </div>
        <div class="column is-4">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => <Pager page={records.page} onPageChange={props.onPageChange} />}
          </Show>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-right">
            {sortOptions().length > 0 && (
              <Sort options={sortOptions()} onChange={props.onSortChange} onClear={props.onSortClear} />
            )}
            <div class="control">
              <ButtonDownload
                title="Download vcf file with records matching filters and search queries"
                onClick={props.onRecordsDownload}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-gapless">
        <div class="column is-full">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => (
              <>
                <RecordsTable fieldConfigs={props.fieldConfigs} records={records.items} />
                <div class="columns is-gapless">
                  <div class="column">
                    <div class="field is-grouped is-grouped-right">
                      <RecordsPerPage initialValue={records.page.size} onChange={props.onRecordsPerPageChange} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Show>
        </div>
      </div>
    </>
  );
};