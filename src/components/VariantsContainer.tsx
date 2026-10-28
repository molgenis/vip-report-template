import { VariantFilters } from "./VariantFilters";
import { HtsFileMetadata, RecordParams } from "@molgenis/vip-report-api";
import { Component, createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import { VariantType } from "../utils/variantType.ts";
import { useNavigate } from "@solidjs/router";
import { initConfig } from "../utils/config/config.ts";
import { createQuery } from "../utils/query/query.ts";
import { PageChangeEvent } from "./Pager";
import { InfoOrder, VariantRecords, writeVcf } from "@molgenis/vip-report-vcf";
import { fetchInfoOrder, fetchRecords, MetadataContainer, SampleContainer } from "../utils/api.ts";
import { createVcfDownloadFilename } from "../utils/download.ts";
import { RecordsPerPageChangeEvent } from "./RecordsPerPage";
import { SortChangeEvent } from "./Sort";
import { VariantTypeChangeEvent, VariantTypeSelect } from "./VariantTypeSelect";
import { Loader } from "./Loader";
import { VariantResults } from "./VariantResults";
import { FilterChangeEvent, FilterClearEvent } from "../types/filter";
import { VariantsContainerHeader } from "./VariantsContainerHeader";
import { href } from "../utils/utils.ts";
import { getPedigreeSamples } from "../utils/sample.ts";
import { ConfigJson } from "../types/config";
import { createSort } from "../utils/query/sort.ts";
import { VariantStore } from "../store/variants.ts";

const SIDEBAR_KEY = "vip-report-filters-sidebar";
const SIDEBAR_DEFAULT = 300;
const SIDEBAR_MIN = 220;
const SIDEBAR_MAX = 540;
// Dragging the edge further left than this collapses the sidebar
const COLLAPSE_THRESHOLD = 120;

const clampWidth = (width: number) => Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, width));

type SidebarState = { width: number; collapsed: boolean };

// Panel icons as used in the variant interpreter (lucide panel-left-open / panel-left-close).
const PanelIcon: Component<{ open: boolean }> = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d={props.open ? "m14 9 3 3-3 3" : "m16 15-3-3 3-3"} />
  </svg>
);

function readSidebar(): SidebarState {
  try {
    const state = JSON.parse(window.localStorage.getItem(SIDEBAR_KEY) ?? "null") as Partial<SidebarState> | null;
    return {
      width: typeof state?.width === "number" ? clampWidth(state.width) : SIDEBAR_DEFAULT,
      collapsed: state?.collapsed === true,
    };
  } catch {
    return { width: SIDEBAR_DEFAULT, collapsed: false };
  }
}

function writeSidebar(state: SidebarState) {
  try {
    window.localStorage.setItem(SIDEBAR_KEY, JSON.stringify(state));
  } catch {
    // storage can be unavailable for reports opened from disk; the sidebar still works for this page
  }
}

export const VariantsContainer: Component<{
  store: VariantStore;
  config: ConfigJson;
  metadata: MetadataContainer;
  variantType: VariantType;
  sample: SampleContainer | null;
  reportId: string;
}> = (props) => {
  const navigate = useNavigate();

  const config = () => initConfig(props.config, props.variantType, props.metadata, props.sample, props.reportId);
  const variantTypeIds = () => (props.sample !== null ? props.sample.variantTypeIds : props.metadata.variantTypeIds);
  const query = () =>
    createQuery(config(), props.metadata, props.variantType, props.sample, props.store.getFilterValues());
  const defaultSort = () => config().variants.sorts.find((configSort) => configSort.selected);
  const sort = () => createSort(props.store.getSort(), defaultSort()) || undefined;
  const defaultRecordsPerPage = () => config().variants.recordsPerPage.find((option) => option.selected)?.number || 10;
  const recordsPerPage = () =>
    props.store.getPageSize() !== null ? props.store.getPageSize()! : defaultRecordsPerPage();

  const sampleIds = () => {
    let sampleIds: number[] | undefined;
    if (props.sample !== null) {
      sampleIds = [props.sample.item.id];
      if (props.sample.maternalSample !== null && props.sample.maternalSample !== undefined) {
        sampleIds.push(props.sample.maternalSample.id);
      }
      if (props.sample.paternalSample !== null && props.sample.paternalSample !== undefined) {
        sampleIds.push(props.sample.paternalSample.id);
      }
    }
    return sampleIds;
  };

  const hasSvTypeField = () => {
    return Object.hasOwn(props.metadata.records.info, "SVTYPE");
  };

  const [records, { refetch }] = createResource(
    (): RecordParams => ({
      query: query() || undefined,
      page: props.store.getPageNumber() || 0,
      size: recordsPerPage(),
      sort: sort(),
      sampleIds: sampleIds(),
    }),
    fetchRecords,
  );

  const onRefresh = async () => {
    await refetch();
  };

  const onFilterChange = (event: FilterChangeEvent) => {
    props.store.setFilterValue(event.id, event.value);
  };
  const onFilterClear = (event: FilterClearEvent) => {
    props.store.clearFilter(event.id);
  };
  const onPageChange = (event: PageChangeEvent) => {
    props.store.setPageNumber(event.page);
  };

  const onRecordsDownload = async () => {
    const samples = props.sample ? getPedigreeSamples(props.sample) : [];
    const filter = samples ? { samples: samples.map((sample) => sample.data.person.individualId) } : undefined;
    const sampleIds = samples ? samples.map((sample) => sample.id) : ([] as number[]);

    const records = await fetchRecords({
      query: query() || undefined,
      page: 0,
      size: Number.MAX_SAFE_INTEGER,
      sampleIds: sampleIds,
    });

    const infoOrder: InfoOrder = await fetchInfoOrder();
    const vcf = writeVcf(
      {
        metadata: props.metadata.records,
        data: records.items.reduce((acc, item) => {
          acc[item.id] = item.data;
          return acc;
        }, {} as VariantRecords),
        infoOrder: infoOrder,
      },
      filter,
    );

    const url = window.URL.createObjectURL(new Blob([vcf]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", createVcfDownloadFilename(props.metadata.app.htsFile as HtsFileMetadata));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onRecordsPerPageChange = (event: RecordsPerPageChangeEvent) => {
    props.store.setPageSize(event.number);
  };
  const onSortChange = (event: SortChangeEvent) => {
    props.store.setSort(event.order);
  };
  const onSortClear = () => {
    props.store.clearSort();
  };
  const onVariantTypeChange = (event: VariantTypeChangeEvent) => {
    const components = props.sample !== null ? ["samples", props.sample.item.id] : [];
    components.push("variants", event.id);
    navigate(href(components));
  };

  const initialSidebar = readSidebar();
  const [sidebarWidth, setSidebarWidth] = createSignal(initialSidebar.width);
  const [sidebarCollapsed, setSidebarCollapsed] = createSignal(initialSidebar.collapsed);
  const [resizing, setResizing] = createSignal(false);
  let sidebarRef: HTMLElement | undefined;
  // distance between the pointer and the sidebar's right edge when a drag starts, so the edge does not jump
  let grabOffset = 0;

  createEffect(() => writeSidebar({ width: sidebarWidth(), collapsed: sidebarCollapsed() }));

  // Drag-to-resize: listen on the document while a drag is in progress
  createEffect(() => {
    if (!resizing()) return;
    const onMove = (event: PointerEvent) => {
      const left = sidebarRef?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - grabOffset - left;
      if (width < COLLAPSE_THRESHOLD) {
        setSidebarCollapsed(true);
        setResizing(false);
        return;
      }
      setSidebarWidth(clampWidth(width));
    };
    const stop = () => setResizing(false);
    // keep the resize cursor and stop text selection during the drag
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);
    onCleanup(() => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", stop);
      document.removeEventListener("pointercancel", stop);
    });
  });

  // Arrow keys resize when the handle is focused
  const onResizeKey = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 48 : 16;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (sidebarWidth() - step < SIDEBAR_MIN) setSidebarCollapsed(true);
      else setSidebarWidth(clampWidth(sidebarWidth() - step));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setSidebarWidth(clampWidth(sidebarWidth() + step));
    } else if (event.key === "Home") {
      event.preventDefault();
      setSidebarWidth(SIDEBAR_DEFAULT);
    }
  };

  return (
    <div class="variants-layout">
      <aside
        ref={sidebarRef}
        class="variants-sidebar"
        classList={{ "is-resizing": resizing(), "is-collapsed": sidebarCollapsed() }}
        style={{ width: `${sidebarCollapsed() ? 0 : sidebarWidth()}px` }}
        aria-hidden={sidebarCollapsed()}
      >
        <div class="variants-sidebar-inner" style={{ width: `${sidebarWidth()}px` }}>
          <div class="variants-sidebar-header">
            <span>Filters</span>
            <button
              type="button"
              class="sidebar-icon-button"
              aria-label="Hide filters"
              title="Hide filters"
              onClick={() => setSidebarCollapsed(true)}
            >
              <PanelIcon open={false} />
            </button>
          </div>
          <Show when={variantTypeIds().size > 1 && hasSvTypeField()}>
            <div class="mb-4">
              <VariantTypeSelect
                value={props.variantType}
                variantTypeIds={variantTypeIds()}
                onChange={onVariantTypeChange}
              />
            </div>
          </Show>
          <VariantFilters
            filterConfigs={config().variants.filters}
            filterValues={props.store.getFilterValues()}
            onFilterChange={onFilterChange}
            onFilterClear={onFilterClear}
            filtersInited={props.store.getFiltersInited()}
            reportId={props.reportId}
          />
        </div>
      </aside>
      {/* the gap between the sidebar and the results panel, up to the panel's edge, is the drag handle */}
      <Show when={!sidebarCollapsed()}>
        <div
          class="sidebar-resizer"
          classList={{ "is-active": resizing() }}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize filters"
          aria-valuemin={SIDEBAR_MIN}
          aria-valuemax={SIDEBAR_MAX}
          aria-valuenow={sidebarWidth()}
          tabIndex={0}
          title="Drag to resize, drag to the left edge to hide · double-click to reset"
          onPointerDown={(event) => {
            event.preventDefault();
            grabOffset = event.clientX - (sidebarRef?.getBoundingClientRect().right ?? event.clientX);
            setResizing(true);
          }}
          onDblClick={() => setSidebarWidth(SIDEBAR_DEFAULT)}
          onKeyDown={onResizeKey}
        />
      </Show>
      <Show when={sidebarCollapsed()}>
        <div class="sidebar-rail">
          <button
            type="button"
            class="sidebar-icon-button"
            aria-label="Show filters"
            title="Show filters"
            onClick={() => setSidebarCollapsed(false)}
          >
            <PanelIcon open={true} />
          </button>
        </div>
      </Show>
      <div class="variants-main">
        <VariantsContainerHeader sample={props.sample} />
        <Show when={records()} fallback={<Loader />}>
          {(records) => (
            <VariantResults
              metadata={props.metadata}
              fieldConfigs={config().variants.cells}
              records={records()}
              reportId={props.reportId}
              sortOptions={config().variants.sorts}
              recordsPerPage={config().variants.recordsPerPage.map((option) => ({
                ...option,
                selected: option.number === recordsPerPage(),
              }))}
              onPageChange={onPageChange}
              onRecordsPerPageChange={onRecordsPerPageChange}
              onRecordsDownload={onRecordsDownload}
              onSortChange={onSortChange}
              onSortClear={onSortClear}
              onRefresh={onRefresh}
            />
          )}
        </Show>
      </div>
    </div>
  );
};
