<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FieldMetadata } from "../../../../api/vcf/MetadataParser";
import { Metadata as RecordMetadata, Record } from "../../../../api/vcf/Vcf";
import GeneEntrezGene from "./GeneEntrezGene.vue";
import GeneUnknown from "./GeneUnknown.vue";
import {
  Value,
  ValueCharacter,
  ValueFlag,
  ValueFloat,
  ValueInteger,
  ValueString,
} from "../../../../api/vcf/ValueParser";

export default defineComponent({
  name: "VipRecordInfoCsqGene",
  components: { GeneEntrezGene, GeneUnknown },
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
