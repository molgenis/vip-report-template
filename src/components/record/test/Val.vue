<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import ValInteger from "./ValInteger.vue";
import ValString from "./ValString.vue";

export default defineComponent({
  name: "VipRecordVal",
  components: { ValInteger, ValString },
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    valueType: {
      type: String as () => "INTEGER" | "STRING",
      required: true,
    },
  },
  setup(props) {
    const { value, valueType } = toRefs(props);
    return {
      child: computed(() => {
        const type = valueType.value;
        switch (type) {
          case "INTEGER":
            return { component: ValInteger, numberValue: value.value as number | null };
          case "STRING":
            return { component: ValString, stringValue: value.value as string | null };
          default:
            throw new Error(`unknown value type`);
        }
      }),
    };
  },
});
</script>

<template>
  <component :is="child.component" :number-value="child.numberValue" :string-value="child.stringValue" />
</template>
