<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VipRecordValueInteger",
  props: {
    numberValue: {
      type: Number,
      default: undefined,
    },
  },
});
</script>

<template>
  <span>{{ numberValue }}</span>
</template>
