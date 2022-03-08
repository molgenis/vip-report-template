<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import RecordTable from "../components/record/Table.vue";
import { useI18n } from "vue-i18n";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";
import { PagedItems } from "../api/Api";
import { Metadata, Record } from "../api/vcf/Vcf";

export default defineComponent({
  name: "VipVariants",
  components: { RecordTable },
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
    const fetchRecords = async () => {
      records.value = await api.getRecords({});
    };
    onMounted(fetchRecords);

    return { t, metadata, records };
  },
});
</script>

<template>
  <template v-if="metadata && records">
    <RecordTable v-if="records.page.totalElements > 0" :records="records.items" :record-metadata="metadata" />
    <p v-else>{{ t("noVariants") }}</p>
  </template>
</template>
