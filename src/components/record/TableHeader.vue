<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VipTableHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    abbreviation: {
      type: String,
      default: null,
    },
  },
});
</script>

<template>
  <abbr v-if="abbreviation && title !== abbreviation" :title="title">{{ abbreviation }}</abbr>
  <span v-else>{{ title }}</span>
</template>
