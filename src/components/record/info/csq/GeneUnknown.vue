<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import {
  Value,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueString,
} from "../../../../api/vcf/ValueParser";
import { asValueString } from "../../../../utils/value";
import FieldValueString from "../../field/FieldValueString.vue";

export default defineComponent({
  name: "VipRecordInfoCsqGeneUnknown",
  components: { FieldValueString },
  props: {
    field: {
      type: [
        Array as () => Value[],
        Boolean as () => ValueFlag,
        Number as () => ValueInteger | ValueFloat,
        String as () => ValueCharacter | ValueString,
      ],
      default: null,
    },
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
    record: {
      type: Object as () => Record,
      required: true,
    },
    recordMetadata: {
      type: Object as () => RecordMetadata,
      required: true,
    },
  },
  setup(props) {
    const field = toRef(props, "field");
    const fieldString = computed(() => asValueString(field.value));
    return { fieldString };
  },
});
</script>

<template>
  <FieldValueString :value="fieldString" :value-type="fieldMetadata.type" />
</template>
