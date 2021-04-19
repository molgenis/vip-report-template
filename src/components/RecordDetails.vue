<template>
  <div>
    <RecordCommonDetails :record="record" />
    <h4>Info</h4>
    <RecordInfoDetails :metadata="metadata.info" :info="record.n" />
    <b-row>
      <b-col>
        <h4>{{ $t('sample') }}</h4>
        <RecordSampleDetails
          :metadata="metadata.format"
          :data="record.s[sample.index]"
          :alleles="[record.r].concat(record.a)"
        />
      </b-col>
      <b-col>
        <h4>{{ $t('father') }}</h4>
        <RecordSampleDetails
          v-if="samplePaternal !== null"
          :metadata="metadata.format"
          :data="record.s[samplePaternal.index]"
          :alleles="[record.r].concat(record.a)"
        />
      </b-col>
      <b-col>
        <h4>{{ $t('mother') }}</h4>
        <RecordSampleDetails
          v-if="sampleMaternal !== null"
          :metadata="metadata.format"
          :data="record.s[sampleMaternal.index]"
          :alleles="[record.r].concat(record.a)"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Api, Vcf } from '@molgenis/vip-report-api';
import RecordCommonDetails from '@/components/RecordCommonDetails.vue';
import RecordInfoDetails from '@/components/RecordInfoDetails.vue';
import RecordSampleDetails from '@/components/RecordSampleDetails.vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  components: { RecordCommonDetails, RecordInfoDetails, RecordSampleDetails },
  props: {
    metadata: Object as PropType<Vcf.Metadata>,
    record: Object as PropType<Vcf.Record>,
    sample: Object as PropType<Api.Sample>
  },
  computed: {
    ...mapGetters(['sampleMaternal', 'samplePaternal'])
  }
});
</script>
