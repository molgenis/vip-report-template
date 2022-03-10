<script lang="ts">
import { defineComponent } from "vue";
import FieldValue from "./FieldValue.vue";
import { asValuePrimitive } from "../../../utils/value";
import {
  Value,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueObject,
  ValueString,
} from "../../../api/vcf/ValueParser";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordFieldNumberSingle",
  components: { FieldValue },
  props: {
    field: {
      type: [
        Array as () => Value[],
        Boolean as () => ValueFlag,
        Number as () => ValueInteger | ValueFloat,
        Object as () => ValueObject,
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
      asValuePrimitive,
    };
  },
});
</script>

<template>
  <FieldValue :value="asValuePrimitive(field)" :value-type="fieldMetadata.type" />
</template>
