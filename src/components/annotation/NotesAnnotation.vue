<template>
  <b-form-input size="sm" v-model="text" type="text" debounce="500" @update="onChange" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    value: { type: String as PropType<string> }
  },
  data() {
    return {
      text: this.value !== null ? this.value : ''
    };
  },
  methods: {
    onChange() {
      this.$emit('update', this.text);
    }
  },
  watch: {
    value(value) {
      this.text = value;
    }
  }
});
</script>
