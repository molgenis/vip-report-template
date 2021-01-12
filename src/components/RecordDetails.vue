<template>
  <div>
    <RecordCommonDetails :record="record" />
    <h4>Info</h4>
    <RecordInfoDetails :metadata="metadata.info" :info="record.n" />
    <b-row>
      <b-col>
        <h4>{{ $t('sample') }}</h4>
        <RecordSampleDetails :metadata="metadata.format" :data="record.s[sample.index]" />
      </b-col>
      <b-col>
        <h4>{{ $t('father') }}</h4>
        <RecordSampleDetails
          v-if="samplePaternal !== null"
          :metadata="metadata.format"
          :data="record.s[samplePaternal.index]"
        />
      </b-col>
      <b-col>
        <h4>{{ $t('mother') }}</h4>
        <RecordSampleDetails
          v-if="sampleMaternal !== null"
          :metadata="metadata.format"
          :data="record.s[sampleMaternal.index]"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Record, RecordsMetadata, Sample } from '@molgenis/vip-report-api';
import RecordCommonDetails from '@/components/RecordCommonDetails.vue';
import RecordInfoDetails from '@/components/RecordInfoDetails.vue';
import RecordSampleDetails from '@/components/RecordSampleDetails.vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  components: { RecordCommonDetails, RecordInfoDetails, RecordSampleDetails },
  props: {
    metadata: Object as PropType<RecordsMetadata>,
    record: Object as PropType<Record>,
    sample: Object as PropType<Sample>
  },
  computed: {
    ...mapGetters(['sampleMaternal', 'samplePaternal'])
  }
});
</script>
