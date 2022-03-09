<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import Anchor from "../../../Anchor.vue";
import {
  Value,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueString,
} from "../../../../api/vcf/ValueParser";
import { asValueIntegerArray } from "../../../../utils/value";

export default defineComponent({
  name: "VipRecordInfoCsqPubMed",
  components: { Anchor },
  props: {
    field: {
      type: [
        Array as () => Value[],
        Boolean as () => ValueFlag,
        Number as () => ValueInteger | ValueFloat,
        String as () => ValueCharacter | ValueString,
      ],
      default: null,
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
    const fieldIntegerArray = computed(() => asValueIntegerArray(field.value));
    return { fieldIntegerArray };
  },
});
</script>

<template>
  <Anchor
    v-if="fieldIntegerArray"
    :href="`https://pubmed.ncbi.nlm.nih.gov/?term=${fieldIntegerArray
      .map((pubMedId) => pubMedId + '[UID]')
      .join('+OR+')}&sort=pubdate`"
    :value="fieldIntegerArray.join(', ')"
  />
</template>
