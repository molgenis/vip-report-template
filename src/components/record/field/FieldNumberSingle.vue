<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import Value from "../value/Value.vue";

export default defineComponent({
  name: "VipRecordFieldNumberSingle",
  components: { Value },
  props: {
    field: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
    },
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
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
  <Value :value="field" :value-type="fieldMetadata.type" />
</template>
