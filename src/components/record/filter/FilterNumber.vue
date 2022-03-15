<script lang="ts">
import { defineComponent, ref, toRef } from "vue";
import { FieldMetadata } from "../../../api/vcf/MetadataParser";
import { useI18n } from "vue-i18n";
import FilterHeader from "./FilterHeader.vue";

export default defineComponent({
  name: "VipRecordFilterNumber",
  components: { FilterHeader },
  props: {
    fieldMetadata: {
      type: Object as () => FieldMetadata,
      required: true,
    },
  },
  emits: ["filter-change", "filter-clear"],
  setup(props, context) {
    const fieldMetadata = toRef(props, "fieldMetadata");

    const inputFromValue = ref("");
    const inputToValue = ref("");
    const onInput = () =>
      context.emit("filter-change", {
        fieldMetadata,
        value: {
          from: inputFromValue.value ? Number(inputFromValue.value) : null,
          to: inputToValue.value ? Number(inputToValue.value) : null,
        },
      });

    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    return { inputFromValue, inputToValue, onInput, t };
  },
});
</script>

<template>
  <FilterHeader :field-metadata="fieldMetadata" />
  <div class="field is-grouped">
    <p class="control is-expanded">
      <input v-model="inputFromValue" class="input is-small" type="text" :placeholder="t('from')" />
    </p>
    <p class="control is-expanded">
      <input v-model="inputToValue" class="input is-small" type="text" :placeholder="t('to')" />
    </p>
    <p class="control">
      <button class="button is-small" @click="onInput">
        <span class="icon"><font-awesome-icon icon="filter" /></span>
      </button>
    </p>
  </div>
</template>
