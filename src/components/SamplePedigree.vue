<template>
  <b-row>
    <b-col>
      <b-row v-if="sample">
        <b-col> {{ $t('sample') }}: <SampleDetails :sample="sample" /> </b-col>
      </b-row>
      <b-row v-if="sample && samplePaternal">
        <b-col> {{ $t('father') }}: <SampleDetails :sample="samplePaternal" /> </b-col>
      </b-row>
      <b-row v-if="sample && sampleMaternal">
        <b-col> {{ $t('mother') }}: <SampleDetails :sample="sampleMaternal" /> </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Sample } from '@molgenis/vip-report-api';
import SampleDetails from '@/components/SampleDetails.vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  components: { SampleDetails },
  props: {
    sample: Object as PropType<Sample>
  },
  computed: {
    ...mapGetters(['getSampleById']),
    samplePaternal(): Sample | null {
      const paternalId = this.sample.person.paternalId;
      return paternalId !== '0' ? this.getSampleById(paternalId) : null;
    },
    sampleMaternal(): Sample | null {
      const maternalId = this.sample.person.maternalId;
      return maternalId !== '0' ? this.getSampleById(maternalId) : null;
    }
  }
});
</script>
