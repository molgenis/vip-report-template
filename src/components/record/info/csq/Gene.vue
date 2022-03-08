<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import { InfoMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import GeneEntrezGene from "./GeneEntrezGene.vue";
import GeneUnknown from "./GeneUnknown.vue";

export default defineComponent({
  name: "VipRecordInfoCsqGene",
  components: { GeneEntrezGene, GeneUnknown },
  props: {
    field: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
    },
    fieldMetadata: {
      type: Object as () => InfoMetadata,
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
    const { recordMetadata } = toRefs(props);
    return {
      component: computed(() => {
        const csqMetadata = recordMetadata.value.info["CSQ"];
        if (csqMetadata && csqMetadata.nested) {
          if (csqMetadata.nested.items.find((item) => item.id === "SYMBOL_SOURCE") !== undefined) {
            return GeneEntrezGene;
          }
        }
        return GeneUnknown;
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
