<script lang="ts">
import { defineComponent } from "vue";
import Bases from "./Bases.vue";
import { Metadata as RecordMetadata, Record } from "../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordAlt",
  components: { Bases },
  props: {
    record: {
      type: Object as () => Record,
      required: true,
    },
    recordMetadata: {
      type: Object as () => RecordMetadata,
      required: true,
    },
  },
});
</script>

<template>
  <template v-for="(alt, index) in record.a" :key="alt">
    <span v-if="index !== 0">, </span>
    <Bases :bases="alt" />
  </template>
</template>
