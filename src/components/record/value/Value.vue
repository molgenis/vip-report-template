<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { ValueType } from "../../../api/vcf/MetadataParser";
import ValueCharacter from "./ValueCharacter.vue";
import ValueInteger from "./ValueInteger.vue";
import ValueFlag from "./ValueFlag.vue";
import ValueFloat from "./ValueFloat.vue";
import ValueString from "./ValueString.vue";

export default defineComponent({
  name: "VipRecordValue",
  components: { ValueCharacter, ValueInteger, ValueFlag, ValueFloat, ValueString },
  props: {
    value: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
    },
    valueType: {
      type: String as () => ValueType,
      required: true,
    },
  },
  setup(props) {
    const valueType = toRef(props, "valueType");
    return {
      component: computed(() => {
        const type = valueType.value;
        switch (type) {
          case "CHARACTER":
            return ValueCharacter;
          case "INTEGER":
            return ValueInteger;
          case "FLAG":
            return ValueFlag;
          case "FLOAT":
            return ValueFloat;
          case "STRING":
            return ValueString;
          case "NESTED":
            throw new Error(`unsupported value type ${type}`);
          default:
            throw new Error(`unknown value type`);
        }
      }),
    };
  },
});
</script>

<template>
  <component :is="component" :value="value" :value-type="valueType" />
</template>
