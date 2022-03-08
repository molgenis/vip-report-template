<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import { FormatMetadata } from "../../../api/vcf/MetadataParser";
import FormatGenotype from "./FormatGenotype.vue";
import Field from "../field/Field.vue";

export default defineComponent({
  name: "VipRecordFormat",
  components: { Field, FormatGenotype },
  props: {
    format: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
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
