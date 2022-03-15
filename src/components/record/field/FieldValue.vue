<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { ValueType } from "../../../api/vcf/MetadataParser";
import FieldValueCharacter from "./FieldValueCharacter.vue";
import FieldValueInteger from "./FieldValueInteger.vue";
import FieldValueFlag from "./FieldValueFlag.vue";
import FieldValueFloat from "./FieldValueFloat.vue";
import FieldValueString from "./FieldValueString.vue";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";

export default defineComponent({
  name: "VipRecordFieldValue",
  components: { FieldValueCharacter, FieldValueInteger, FieldValueFlag, FieldValueFloat, FieldValueString },
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
    const valueType = toRef(props, "valueType");
    return {
      component: computed(() => {
        const type = valueType.value;
        switch (type) {
          case "CATEGORICAL":
            return FieldValueString;
          case "CHARACTER":
            return FieldValueCharacter;
          case "INTEGER":
            return FieldValueInteger;
          case "FLAG":
            return FieldValueFlag;
          case "FLOAT":
            return FieldValueFloat;
          case "STRING":
            return FieldValueString;
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
