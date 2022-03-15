<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "VipSearchBox",
  emits: ["search-change"],
  setup(props, context) {
    const inputValue = ref("");
    const onInput = () => context.emit("search-change", inputValue.value);

    const onInputClear = () => {
      inputValue.value = "";
      context.emit("search-change", inputValue.value);
    };
    return { inputValue, onInput, onInputClear };
  },
});
</script>

<template>
  <div class="field has-addons">
    <p class="control has-icons-right is-expanded">
      <input v-model="inputValue" class="input" type="text" @keyup.enter="onInput" @keyup.esc="onInputClear" />
      <span v-if="inputValue.length > 0" class="icon is-clickable is-small is-right" @click="onInputClear">
        <font-awesome-icon icon="circle-xmark" />
      </span>
    </p>
    <div class="control">
      <a class="button is-info" @click="onInput">
        <span class="icon is-small is-left">
          <font-awesome-icon icon="search" />
        </span>
      </a>
    </div>
  </div>
</template>
