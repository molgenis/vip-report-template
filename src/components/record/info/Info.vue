<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from "vue";
import { Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import { InfoMetadata } from "../../../api/vcf/MetadataParser";
import Field from "../field/Field.vue";
import Gene from "./csq/Gene.vue";
import Consequence from "./csq/Consequence.vue";
import PubMed from "./csq/PubMed.vue";

export default defineComponent({
  name: "VipRecordInfo",
  components: { Consequence, Field, Gene, PubMed },
  props: {
    info: {
      type: [Array, Boolean, Number, String] as PropType<unknown>,
    },
    infoMetadata: {
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
    const { infoMetadata } = toRefs(props);
    return {
      component: computed(() => {
        switch (infoMetadata.value.id) {
          case "Consequence":
            return Consequence;
          case "Gene":
            return Gene;
          case "PUBMED":
            return PubMed;
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
    :field="info"
    :field-metadata="infoMetadata"
    :record="record"
    :record-metadata="recordMetadata"
  />
</template>
