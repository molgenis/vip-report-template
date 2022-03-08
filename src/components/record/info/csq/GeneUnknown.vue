<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import ValueString from "../../value/ValueString.vue";

export default defineComponent({
  name: "VipRecordInfoCsqGeneUnknown",
  components: { ValueString },
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
    const fieldTyped = computed(() => field.value as string | null);
    return { fieldTyped };
  },
});
</script>

<template>
  <ValueString :value="fieldTyped" :value-type="fieldMetadata.type" />
</template>
