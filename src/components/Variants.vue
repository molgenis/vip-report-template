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
    const fetchVcf = async () => {
      vcf.value = await api.getVcf();
    };

    onMounted(fetchVcf);

    return { metadata, vcf };
  },
});
</script>

<template>
  <textarea v-if="vcf" v-model="vcf" rows="50" cols="200" wrap="off"></textarea>
</template>
