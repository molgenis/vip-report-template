<script lang="ts">
import { defineComponent } from "vue";
import { asValuePrimitiveArray } from "../../../utils/value";
import { Value, ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordFieldPerAltAndRef",
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
  setup() {
    return {
      asValuePrimitiveArray,
    };
  },
});
</script>

<template>
  <template v-for="(item, index) in asValuePrimitiveArray(field)" :key="index">
    <span v-if="index !== 0">, </span>
    <!-- FIXME use Value -->
    <span>{{ index === 0 ? record.r + "=" + item : record.a[index] + "=" + item }}</span>
  </template>
</template>
