<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import FilterDefault from "./FilterDefault.vue";
import { FilterChangeEvent, FilterClearEvent } from "../../../utils/filter";

export default defineComponent({
  name: "VipRecordFilter",
  components: { FilterDefault },
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
  emits: ["filter-change", "filter-clear"],
  setup(props, context) {
    const fieldMetadata = toRef(props, "fieldMetadata");

    const component = computed(() => {
      switch (fieldMetadata.value.id) {
        // add your own custom filters here
        default:
          if (fieldMetadata.value.type === "CHARACTER" || fieldMetadata.value.type === "STRING") {
            return null;
          }
          if (fieldMetadata.value.number.count !== 1) {
            return null;
          }
          return FilterDefault;
      }
    });

    return {
      component,
      onFilterChange: (event: FilterChangeEvent) => context.emit("filter-change", event),
      onFilterClear: (event: FilterClearEvent) => context.emit("filter-clear", event),
    };
  },
});
</script>

<template>
  <template v-if="component">
    <component
      :is="component"
      :field-metadata="fieldMetadata"
      @filter-change="onFilterChange"
      @filter-clear="onFilterClear"
    />
  </template>
</template>
