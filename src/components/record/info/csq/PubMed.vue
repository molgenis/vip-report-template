<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import Anchor from "../../../Anchor.vue";

export default defineComponent({
  name: "VipRecordInfoCsqPubMed",
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
    const fieldTyped = computed(() => field.value as number[] | null | undefined);
    return { fieldTyped };
  },
});
</script>

<template>
  <Anchor
    v-if="fieldTyped"
    :href="`https://pubmed.ncbi.nlm.nih.gov/?term=${fieldTyped
      .map((pubMedId) => pubMedId + '[UID]')
      .join('+OR+')}&sort=pubdate`"
    :value="fieldTyped.join(', ')"
  />
</template>
