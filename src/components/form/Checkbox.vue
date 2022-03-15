<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "VCheckbox",
  props: {
    modelValue: {
      type: [String, Array as () => string[]],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["change", "update:modelValue"],
  setup(props, { emit }) {
    const computedValue = computed({
      get: () => props.modelValue,
      set: (newValue) => emit("update:modelValue", newValue),
    });

    const handleChange = (event: Event) => emit("change", { value: (event.target as HTMLInputElement).checked });

    return {
      computedValue,
      handleChange,
    };
  },
});
</script>

<template>
  <label class="checkbox">
    <input v-model="computedValue" type="checkbox" :value="value" @change="handleChange" />
    <slot />
  </label>
</template>
