<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { asValueString } from "../../../utils/value";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFieldValueString",
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
    const valString = computed(() => asValueString(val.value));
    return { valString };
  },
});
</script>

<template>
  <span v-if="valString">{{ valString }}</span>
</template>
