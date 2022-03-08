<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordValueString",
  props: {
    value: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
    },
    valueType: {
      type: String as () => ValueType,
      required: true,
    },
  },
  setup(props) {
    const value = toRef(props, "value");
    const valueTyped = computed(() => value.value as string | null);
    return { valueTyped };
  },
});
</script>

<template>
  <span>{{ valueTyped }}</span>
</template>
