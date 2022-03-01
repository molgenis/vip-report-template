<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { injectStrict } from "../utils/inject";
import { ApiKey } from "../utils/symbols";

export default defineComponent({
  name: "VipVcf",
  setup() {
    const api = injectStrict(ApiKey);

    let vcf: Ref<string | undefined> = ref();
    const fetchVcf = async () => {
      vcf.value = await api.getVcf();
    };

    onMounted(fetchVcf);

    return { vcf };
  },
});
</script>

<template>
  <textarea v-if="vcf" v-model="vcf" rows="50" cols="200" wrap="off"></textarea>
</template>
