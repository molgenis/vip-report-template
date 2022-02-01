<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { Metadata } from "../api/Api";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";

export default defineComponent({
  name: "VipVariants",
  setup() {
    const api = injectStrict(ApiKey);

    let metadata: Ref<Metadata | undefined> = ref();
    let vcf: Ref<string | undefined> = ref();
    const fetchRecords = async () => {
      metadata.value = await api.getMeta();
      vcf.value = await api.getVcf();
    };

    onMounted(fetchRecords);

    return { metadata, vcf };
  },
});
</script>

<template>
  <span v-if="metadata">{{ metadata }}</span>
  <hr />
  <span v-if="vcf">{{ vcf }}</span>
</template>
