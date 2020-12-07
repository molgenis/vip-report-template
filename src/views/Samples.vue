<template>
  <b-row>
    <b-col cols="1">
      <SampleNavigation v-if="samples" :samples="samples" />
    </b-col>
    <b-col>
      <SampleReport v-if="selectedSample" :sample="selectedSample" :phenotypes="selectedSamplePhenotypes" />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import SampleNavigation from '@/components/SampleNavigation.vue';
import SampleReport from '@/components/SampleReport.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { Sample } from '@molgenis/vip-report-api';

export default Vue.extend({
  components: { SampleNavigation, SampleReport },
  computed: {
    ...mapGetters(['samples', 'getSampleById']),
    ...mapState(['selectedSample', 'selectedSamplePhenotypes', 'selectedSampleInheritance', 'selectedSampleDenovo'])
  },
  methods: {
    ...mapActions(['loadMetadata', 'loadSamples', 'selectSample']),
    getId(sample: Sample) {
      return sample.person.individualId;
    }
  },
  async created() {
    await this.loadMetadata();
    await this.loadSamples();
    if (this.$route.params.id) {
      const sample = this.getSampleById(this.$route.params.id);
      this.selectSample(sample);
    } else {
      const sample = this.samples.find((sample: Sample) => sample.index !== -1 && sample.proband === true);
      if (sample !== null) {
        await this.$router.push({ params: { id: this.getId(sample) } });
      }
    }
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        const sample = this.getSampleById(to.params.id);
        this.selectSample(sample);
      }
    }
  }
});
</script>
