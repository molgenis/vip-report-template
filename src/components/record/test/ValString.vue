<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VipRecordValueString",
  props: {
    stringValue: {
      type: String,
      default: null,
    },
  },
});
</script>

<template>
  <span>{{ stringValue }}</span>
</template>
