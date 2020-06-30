<template>
  <span>
    <span v-for="(value, index) in values" :key="index">
      <RecordInfoDetailsItem :metadata="metadata" :value="value" />
      <br v-if="index < values.length - 1" />
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InfoMetadata } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';

export default Vue.extend({
  components: { RecordInfoDetailsItem },
  props: {
    metadata: Object as PropType<InfoMetadata>,
    values: Array as PropType<(string | number | boolean | object | string[] | number[] | boolean[] | object[])[]>
  }
});
</script>
