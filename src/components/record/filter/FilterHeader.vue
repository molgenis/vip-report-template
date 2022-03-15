<script lang="ts">
import { defineComponent } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";

export default defineComponent({
  name: "VipRecordFilterHeader",
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
});
</script>

<template>
  <p class="has-text-weight-semibold">
    <abbr
      v-if="fieldMetadata.description && fieldMetadata.id !== fieldMetadata.description"
      :title="fieldMetadata.description"
      >{{ fieldMetadata.id }}</abbr
    >
    <span v-else>{{ fieldMetadata.id }}</span>
  </p>
</template>
