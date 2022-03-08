<script lang="ts">
import { defineComponent } from "vue";
import { Metadata as RecordMetadata, Record } from "../../api/vcf/Vcf";
import Bases from "./Bases.vue";

export default defineComponent({
  name: "VipRecordRef",
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
  <Bases :bases="record.r" />
</template>
