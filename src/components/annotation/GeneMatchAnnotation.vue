<template>
  <b-form-select v-model="selected" :options="options" size="sm" @change="onChange" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    value: { type: String as PropType<string> }
  },
  data() {
    return {
      selected: this.value,
      options: [
        { value: null, text: '' },
        { value: 'true', text: 'Yes' },
        { value: 'false', text: 'No' }
      ]
    };
  },
  methods: {
    onChange() {
      this.$emit('update', this.selected);
    }
  },
  watch: {
    value(value) {
      this.selected = value;
    }
  }
});
</script>
