<script lang="ts">
import { defineComponent, Ref, ref, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import FilterHeader from "./FilterHeader.vue";
import { FilterValueCategorical } from "../../../utils/filter";

export default defineComponent({
  name: "VipRecordFilterCategorical",
  components: { FilterHeader },
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
  emits: ["filter-change", "filter-clear"],
  setup(props, context) {
    const fieldMetadata = toRef(props, "fieldMetadata");
    const checkedCategories: Ref<FilterValueCategorical> = ref([]);

    const onCategoryChange = () => {
      if (checkedCategories.value.length > 0) {
        context.emit("filter-change", { fieldMetadata, value: checkedCategories.value });
      } else {
        context.emit("filter-clear", { fieldMetadata });
      }
    };

    return { checkedCategories, onCategoryChange };
  },
});
</script>

<template>
  <FilterHeader :field-metadata="fieldMetadata" />
  <div class="field">
    <div v-for="category in fieldMetadata.categories" :key="category" class="control">
      <label class="checkbox">
        <input v-model="checkedCategories" type="checkbox" :value="category" @change="onCategoryChange" />
        {{ category }}</label
      >
    </div>
  </div>
</template>
