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
import { asValueString } from "../../../../utils/value";

export default defineComponent({
  name: "VipRecordInfoCsqGeneEntrezGene",
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
    const fieldString = computed(() => asValueString(field.value));
    return { fieldString };
  },
});
</script>

<template>
  <!-- FIXME use ValueString instead of :value. slot? -->
  <Anchor
    v-if="fieldString"
    :href="'https://www.ncbi.nlm.nih.gov/gene/' + encodeURIComponent(fieldString)"
    :value="fieldString"
  />
</template>
