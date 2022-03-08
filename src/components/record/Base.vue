<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VipRecordBase",
  props: {
    base: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <span :class="['base', 'base-' + base.toLowerCase()]">{{ base.toUpperCase() }}</span>
</template>
