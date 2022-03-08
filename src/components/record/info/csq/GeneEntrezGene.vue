<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import Anchor from "../../../Anchor.vue";

export default defineComponent({
  name: "VipRecordInfoCsqGeneEntrezGene",
  components: { Anchor },
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
    const fieldTyped = computed(() => field.value as string | null | undefined);
    return { fieldTyped };
  },
});
</script>

<template>
  <!-- FIXME use ValueString instead of :value. slot? -->
  <Anchor
    v-if="fieldTyped"
    :href="'https://www.ncbi.nlm.nih.gov/gene/' + encodeURIComponent(fieldTyped)"
    :value="fieldTyped"
  />
</template>
