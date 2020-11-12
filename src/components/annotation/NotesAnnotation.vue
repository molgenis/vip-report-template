<template>
  <b-form-textarea
    v-if="focus"
    v-focus
    size="sm"
    v-model="text"
    type="text"
    debounce="500"
    @blur="focus = false"
    @update="onChange"
  />
  <b-form-input v-else size="sm" :value="text" type="text" debounce="500" @focus="focus = true" @update="onChange" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  props: {
    value: { type: String as PropType<string> }
  },
  data() {
    return {
      text: this.value !== null ? this.value : '',
      focus: false
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
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
});
</script>
