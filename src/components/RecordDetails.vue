<template>
  <div>
    <RecordCommonDetails :record="record" />
    <h4>Info</h4>
    <RecordInfoDetails :metadata="metadata.info" :info="record.n" />
    <h4>Sample</h4>
    <RecordSampleDetails :metadata="metadata.format" :data="record.s[sample.index]" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Record, RecordsMetadata, Sample } from '@molgenis/vip-report-api';
import RecordCommonDetails from '@/components/RecordCommonDetails.vue';
import RecordInfoDetails from '@/components/RecordInfoDetails.vue';
import RecordSampleDetails from '@/components/RecordSampleDetails.vue';

export default Vue.extend({
  components: { RecordCommonDetails, RecordInfoDetails, RecordSampleDetails },
  props: {
    metadata: Object as PropType<RecordsMetadata>,
    record: Object as PropType<Record>,
    sample: Object as PropType<Sample>
  }
});
</script>
