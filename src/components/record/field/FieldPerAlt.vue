<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import Value from "../value/Value.vue";

export default defineComponent({
  name: "VipRecordFieldPerAlt",
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
  setup(props) {
    const field = toRef(props, "field");
    const fieldTyped = computed(() => field.value as unknown[] | null | undefined);
    return { fieldTyped };
  },
});
</script>

<template>
  <template v-if="fieldTyped">
    <template v-for="(item, index) in fieldTyped" :key="index">
      <span v-if="index !== 0">, </span>
      <span v-if="record.a.length > 1">{{ record.a[index] }}=</span>
      <Value :value="item" :value-type="fieldMetadata.type" />
    </template>
  </template>
</template>
