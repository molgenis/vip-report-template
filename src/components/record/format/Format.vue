<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import { FormatMetadata } from "../../../api/vcf/MetadataParser";
import FormatGenotype from "./FormatGenotype.vue";
import Field from "../field/Field.vue";
import {
  Value,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueObject,
  ValueString,
} from "../../../api/vcf/ValueParser";

export default defineComponent({
  name: "VipRecordFormat",
  components: { Field, FormatGenotype },
  props: {
    format: {
      type: [
        Array as () => Value[],
        Boolean as () => ValueFlag,
        Number as () => ValueInteger | ValueFloat,
        Object as () => ValueObject,
        String as () => ValueCharacter | ValueString,
      ],
      default: null,
    },
    formatMetadata: {
      type: Object as () => FormatMetadata,
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
    const { formatMetadata } = toRefs(props);
    return {
      component: computed(() => {
        switch (formatMetadata.value.id) {
          case "GT":
            return FormatGenotype;
          default:
            return Field;
        }
      }),
    };
  },
});
</script>

<template>
  <component
    :is="component"
    :field="format"
    :field-metadata="formatMetadata"
    :record="record"
    :record-metadata="recordMetadata"
  />
</template>
