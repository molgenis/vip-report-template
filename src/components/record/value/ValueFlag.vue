<script lang="ts">
import { computed, defineComponent, PropType, toRef } from "vue";
import { ValueType } from "../../../api/vcf/MetadataParser";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VipRecordValueFlag",
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
    const value = toRef(props, "value");
    const valueTyped = computed(() => value.value as boolean | null | undefined);

    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    return { t, valueTyped };
  },
});
</script>

<template>
  <span>{{ valueTyped === true ? t("flagTrue") : valueTyped === false ? t("flagFalse") : t("flagUnknown") }}</span>
</template>
