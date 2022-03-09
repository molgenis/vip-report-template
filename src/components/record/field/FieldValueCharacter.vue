<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { asValueCharacter } from "../../../utils/value";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFieldValueCharacter",
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
    const valCharacter = computed(() => asValueCharacter(val.value));
    return { valCharacter };
  },
});
</script>

<template>
  <span v-if="valCharacter">{{ valCharacter }}</span>
</template>
