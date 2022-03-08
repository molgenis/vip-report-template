<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VipAnchor",
  props: {
    href: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
});
</script>

<template>
  <a :href="href" target="_blank" rel="noopener noreferrer nofollow">{{ value }}</a>
</template>
