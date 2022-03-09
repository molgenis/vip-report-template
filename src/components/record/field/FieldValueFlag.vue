<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { asValueFlag } from "../../../utils/value";
import { ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { ValueType } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFieldValueFlag",
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
    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    const val = toRef(props, "value");
    const valFlag = computed(() => asValueFlag(val.value));
    return { t, valFlag };
  },
});
</script>

<template>
  <span>{{ valFlag === true ? t("flagTrue") : valFlag === false ? t("flagFalse") : t("flagUnknown") }}</span>
</template>
