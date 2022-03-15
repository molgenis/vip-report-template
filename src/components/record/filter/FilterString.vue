<script lang="ts">
import { defineComponent, ref } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import FilterHeader from "./FilterHeader.vue";

export default defineComponent({
  name: "VipRecordFilterString",
  components: { FilterHeader },
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
  emits: ["filter-change", "filter-clear"],
  setup(props, context) {
    const inputValue = ref("");
    const onInput = () => context.emit("filter-change", { value: inputValue });

    return { inputFromValue: inputValue, onInput };
  },
});
</script>

<template>
  <FilterHeader :field-metadata="fieldMetadata" />
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input v-model="inputFromValue" class="input is-small" type="text" />
    </p>
    <p class="control">
      <button class="button is-small" @click="onInput">
        <span class="icon"><font-awesome-icon icon="filter" /></span>
      </button>
    </p>
  </div>
</template>
