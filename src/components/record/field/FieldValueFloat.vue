<script lang="ts">
import { defineComponent } from "vue";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFieldValueFloat",
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
  <abbr v-if="value !== null && typeof value === 'number'" :title="value.toString()">{{ value.toFixed(4) }}</abbr>
</template>
