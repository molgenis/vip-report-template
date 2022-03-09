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
import { asValueStringArray } from "../../../../utils/value";

export default defineComponent({
  name: "VipRecordInfoCsqConsequence",
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
    const fieldStringArray = computed(() => asValueStringArray(field.value));
    return { fieldStringArray };
  },
});
</script>

<template>
  <template v-if="fieldStringArray">
    <template v-for="(item, index) in fieldStringArray" :key="index">
      <span v-if="index !== 0">, </span>
      <Anchor
        v-if="item !== null"
        :href="`http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=${encodeURIComponent(
          item
        )}&release=current_release`"
        :value="item"
      />
    </template>
  </template>
</template>
