<script lang="ts">
import { computed, defineComponent } from "vue";
import RecordBase from "./Base.vue";

export default defineComponent({
  name: "VipRecordBases",
  components: { RecordBase },
  props: {
    bases: {
      type: String as () => string | null,
      required: true,
    },
  },
  setup(props) {
    return {
      baseArray: computed(() => (props.bases !== null ? [...props.bases] : ["?"])),
    };
  },
});
</script>

<template>
  <RecordBase v-for="base in baseArray" :key="base" :base="base" />
</template>
