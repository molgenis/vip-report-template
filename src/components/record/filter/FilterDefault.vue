<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import FilterString from "./FilterString.vue";
import FilterNumber from "./FilterNumber.vue";
import FilterBoolean from "./FilterBoolean.vue";
import FilterCategorical from "./FilterCategorical.vue";
import { FilterChangeEvent, FilterClearEvent } from "../../../utils/filter";

export default defineComponent({
  name: "VipRecordFilterDefault",
  components: { FilterBoolean, FilterCategorical, FilterNumber, FilterString },
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
      switch (fieldMetadata.value.type) {
        case "CATEGORICAL":
          return FilterCategorical;
        case "CHARACTER":
        case "STRING":
          return FilterString;
        case "FLAG":
          return FilterBoolean;
        case "FLOAT":
        case "INTEGER":
          return FilterNumber;
        case "NESTED":
          throw new Error(`unsupported value type`);
        default:
          throw new Error(`unknown value type`);
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
  <component
    :is="component"
    :field-metadata="fieldMetadata"
    @filter-change="onFilterChange"
    @filter-clear="onFilterClear"
  />
</template>
