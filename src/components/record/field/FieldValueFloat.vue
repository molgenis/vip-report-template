<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { asValueFloat } from "../../../utils/value";
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
  setup(props) {
    const val = toRef(props, "value");
    const valFloat = computed(() => asValueFloat(val.value));
    return { valFloat };
  },
});
</script>

<template>
  <abbr v-if="valFloat !== null" :title="valFloat.toString()">{{ valFloat.toFixed(4) }}</abbr>
</template>
