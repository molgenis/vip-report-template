<script lang="ts">
import { defineComponent } from "vue";
import { Metadata as RecordMetadata, Record } from "../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordPos",
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
  <span>{{ record.c }}:{{ record.p }}</span>
</template>
