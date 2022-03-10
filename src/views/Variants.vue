<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import RecordTable from "../components/record/Table.vue";
import { useI18n } from "vue-i18n";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";
import { PagedItems, Params } from "../api/Api";
import { Metadata, Record } from "../api/vcf/Vcf";
import Pagination from "../components/Pagination.vue";

export default defineComponent({
  name: "VipVariants",
  components: { Pagination, RecordTable },
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
    onMounted(() => fetchRecords({ page: 0 }));

    const onPageChange = (page: number) => fetchRecords({ page: page });
    return { t, metadata, records, onPageChange };
  },
});
</script>

<template>
  <template v-if="metadata && records">
    <template v-if="records.items.length > 0">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <Pagination :page="records.page" @change="onPageChange" />
        </div>
        <div class="column is-one-quarter">
          <span class="is-pulled-right"
            >{{ records.page.totalElements }} {{ t(records.page.totalElements === 1 ? "record" : "records") }}</span
          >
        </div>
      </div>
      <RecordTable :records="records.items" :record-metadata="metadata" />
    </template>
    <p v-else>{{ t("noVariants") }}</p>
  </template>
</template>
