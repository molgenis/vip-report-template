<template>
  <span>
    <span v-for="(value, index) in values" :key="index">
      <RecordInfoDetailsItem :metadata="metadata" :value="value" :details="details" />
      <br v-if="index < values.length - 1" />
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';

export default Vue.extend({
  components: { RecordInfoDetailsItem },
  props: {
    metadata: Object as PropType<Vcf.InfoMetadata>,
    values: Array as PropType<(string | number | boolean | unknown | string[] | number[] | boolean[] | unknown[])[]>,
    details: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  }
});
</script>
