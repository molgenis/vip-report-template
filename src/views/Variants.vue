<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from "vue";
import RecordTable from "../components/record/Table.vue";
import { useI18n } from "vue-i18n";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";
import { PagedItems, Params } from "../api/Api";
import { Metadata, Record } from "../api/vcf/Vcf";
import Pagination from "../components/Pagination.vue";
import SearchBox from "../components/SearchBox.vue";
import { createFilterQuery, createSearchQuery } from "../utils/query";
import Filters from "../components/record/filter/Filters.vue";
import { FiltersChangeEvent } from "../utils/filter";

export default defineComponent({
  name: "VipVariants",
  components: { Pagination, Filters, RecordTable, SearchBox },
  setup() {
    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    const api = injectStrict(ApiKey);

    let metadata: Ref<Metadata | undefined> = ref();
    const fetchMetadata = async () => {
      metadata.value = await api.getRecordsMeta();
    };
    onMounted(fetchMetadata);

    let records: Ref<PagedItems<Record> | undefined> = ref();
    const fetchRecords = async (params: Params) => {
      records.value = await api.getRecords(params);
    };

    const params: Ref<Params> = ref({});
    const onPageChange = (page: number) => (params.value = { ...params.value, ...{ page } });

    const onSearchChange = (search: string) => {
      const metadataValue = metadata.value;
      if (metadataValue) {
        const newParams = {
          ...params.value,
          page: 0,
        };

        const query = createSearchQuery(search, metadataValue);
        newParams.query = search !== "" && query !== null ? query : undefined;
        params.value = newParams;
        console.log(newParams);
      }
    };

    const onFiltersChange = (event: FiltersChangeEvent) => {
      console.log("Variants:onFiltersChange");
      const newParams = {
        ...params.value,
        page: 0,
      };
      newParams.query = event.filters.length > 0 ? createFilterQuery(event.filters) : undefined;
      console.log(newParams.query);
      params.value = newParams;
    };

    watch(
      params,
      async (currentValue) => {
        await fetchRecords(currentValue);
      },
      { immediate: true }
    );

    return { t, metadata, records, onPageChange, onSearchChange, onFiltersChange };
  },
});
</script>

<template>
  <template v-if="metadata && records">
    <div class="columns">
      <div class="column is-2">
        <SearchBox @search-change="onSearchChange" />
      </div>
      <template v-if="records.items.length > 0">
        <div class="column is-4 is-offset-3">
          <Pagination :page="records.page" @page-change="onPageChange" />
        </div>
        <div class="column is-2 is-offset-1">
          <span class="is-pulled-right"
            >{{ records.page.totalElements }} {{ t(records.page.totalElements === 1 ? "record" : "records") }}</span
          >
        </div>
      </template>
      <p v-else>{{ t("noVariants") }}</p>
    </div>
    <div class="columns">
      <div class="column is-2">
        <Filters :info-metadata-container="metadata.info" @filters-change="onFiltersChange" />
      </div>
      <div class="column is:10">
        <RecordTable :records="records.items" :record-metadata="metadata" />
      </div>
    </div>
  </template>
</template>
