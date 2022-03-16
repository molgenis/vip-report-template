<script lang="ts">
import { defineComponent } from "vue";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFieldValueInteger",
  props: {
    value: {
      type: [
        Boolean as () => ValueFlag,
        Number as () => ValueInteger | ValueFloat,
        String as () => ValueCharacter | ValueString,
      ],
      default: null,
    },
    valueType: {
      type: String as () => ValueType,
      required: true,
    },
  },
});
</script>

<template>
  <span v-if="value != null">{{ value }}</span>
</template>
