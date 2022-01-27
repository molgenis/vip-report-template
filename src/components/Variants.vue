<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { Metadata } from "../api/Api";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";

export default defineComponent({
  name: "VipVariants",
  setup() {
    const api = injectStrict(ApiKey);

    let metadata: Ref<Metadata | undefined> = ref();
    const fetchRecords = async () => {
      metadata.value = await api.getMeta();
    };

    fetchRecords();

    return { metadata };
  },
});
</script>

<template>
  <span v-if="metadata">{{ metadata }}</span>
</template>
