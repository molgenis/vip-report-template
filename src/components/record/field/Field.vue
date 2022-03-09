<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import FieldPerAlt from "./FieldPerAlt.vue";
import FieldPerAltAndRef from "./FieldPerAltAndRef.vue";
import FieldOther from "./FieldOther.vue";
import FieldNumberMultiple from "./FieldNumberMultiple.vue";
import FieldNumberSingle from "./FieldNumberSingle.vue";
import { Value, ValueCharacter, ValueFlag, ValueFloat, ValueInteger, ValueString } from "../../../api/vcf/ValueParser";

export default defineComponent({
  name: "VipRecordField",
  components: { FieldNumberMultiple, FieldOther, FieldPerAlt, FieldPerAltAndRef, FieldNumberSingle },
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
    const { fieldMetadata } = toRefs(props);
    return {
      component: computed(() => {
        const type = fieldMetadata.value.number.type;
        switch (type) {
          case "NUMBER":
            return fieldMetadata.value.number.count === 1 ? FieldNumberSingle : FieldNumberMultiple;
          case "OTHER":
            return FieldOther;
          case "PER_ALT":
            return FieldPerAlt;
          case "PER_ALT_AND_REF":
            return FieldPerAltAndRef;
          default:
            throw new Error(`invalid info type ${type}`);
        }
      }),
    };
  },
});
</script>

<template>
  <component
    :is="component"
    :field="field"
    :field-metadata="fieldMetadata"
    :record="record"
    :record-metadata="recordMetadata"
  />
</template>
