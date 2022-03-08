<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordFieldPerAltAndRef",
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
  setup(props) {
    const field = toRef(props, "field");
    const fieldTyped = computed(() => field.value as unknown[] | null | undefined);
    return { fieldTyped };
  },
});
</script>

<template>
  <template v-for="(item, index) in fieldTyped" :key="index">
    <span v-if="index !== 0">, </span>
    <!-- FIXME use Value -->
    <span>{{ index === 0 ? record.r + "=" + item : record.a[index] + "=" + item }}</span>
  </template>
</template>
