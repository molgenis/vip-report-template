<script lang="ts">
import { defineComponent } from "vue";
import FilterHeader from "./FilterHeader.vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFilterBoolean",
  components: { FilterHeader },
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
  emits: ["filter-change", "filter-clear"],
});
</script>

<template>
  <FilterHeader :field-metadata="fieldMetadata" />
  <h1>todo:implement</h1>
</template>
