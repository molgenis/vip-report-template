<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { Genotype, Metadata as RecordMetadata, Record } from "../../../api/vcf/Vcf";
import { FormatMetadata } from "../../../api/vcf/MetadataParser";
import Bases from "../Bases.vue";
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
  name: "VipRecordFormatGenotype",
  components: { Bases },
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
    const field = toRef(props, "field");
    const fieldTyped = computed(() => field.value as Genotype | null);
    return { fieldTyped };
  },
});
</script>

<template>
  <template v-if="fieldTyped">
    <template v-for="(alleleIndex, alleleIndexIndex) in fieldTyped.a" :key="alleleIndexIndex">
      <template v-if="alleleIndexIndex !== 0">
        <span v-if="fieldTyped.p">|</span>
        <span v-else>/</span>
      </template>
      <Bases v-if="alleleIndex === null" bases="?" />
      <Bases v-else-if="alleleIndex === 0" :bases="record.r" />
      <Bases v-else :bases="record.a[alleleIndex - 1]" />
    </template>
  </template>
</template>
