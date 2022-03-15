<script lang="ts">
import { computed, defineComponent, Ref, ref, toRef } from "vue";
import { FieldMetadataContainer } from "../../../api/vcf/VcfParser";
import Filter from "./Filter.vue";
import { flattenFieldMetadata, getId } from "../../../utils/field";
import { FilterChangeEvent, FilterClearEvent } from "../../../utils/filter";

export default defineComponent({
  name: "VipRecordFilters",
  components: { Filter },
  props: {
    infoMetadataContainer: {
      type: Object as () => FieldMetadataContainer,
      required: true,
    },
  },
  emits: ["filters-change"],
  setup(props, context) {
    const filters: Ref<{ [key: string]: FilterChangeEvent }> = ref({});

    const infoMetadataContainer = toRef(props, "infoMetadataContainer");
    const infoMetadataItems = computed(() => flattenFieldMetadata(infoMetadataContainer.value));

    const onFiltersChange = () => context.emit("filters-change", { filters: Object.values(filters.value) });

    const onFilterChange = (event: FilterChangeEvent) => {
      filters.value[getId(event.fieldMetadata)] = event;
      onFiltersChange();
    };
    const onFilterClear = (event: FilterClearEvent) => {
      delete filters.value[getId(event.fieldMetadata)];
      onFiltersChange();
    };

    return { infoMetadataItems, onFilterChange, onFilterClear };
  },
});
</script>

<template>
  <Filter
    v-for="(infoMetadata, index) in infoMetadataItems"
    :key="index"
    :field-metadata="infoMetadata"
    @filter-change="onFilterChange"
    @filter-clear="onFilterClear"
  />
</template>
