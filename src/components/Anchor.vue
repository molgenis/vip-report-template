<template>
  <a :href="href" target="_blank" rel="noopener noreferrer nofollow">
    {{ text }}
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    href: String as PropType<string>,
    text: [String, Number, Boolean] as PropType<string | number | boolean>
  }
});
</script>
